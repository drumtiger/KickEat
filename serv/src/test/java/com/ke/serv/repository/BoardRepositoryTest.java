// BoardRepositoryTest.java
package com.ke.serv.repository;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.entity.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.transaction.support.TransactionSynchronizationManager; // 추가

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@EntityScan(basePackages = "com.ke.serv.entity")
@EnableJpaRepositories(basePackages = "com.ke.serv.repository")
class BoardRepositoryTest {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // UserEntity 생성 및 저장 (모든 필수 필드에 값 설정)
        UserEntity user = new UserEntity();
        user.setUserid("testuser");
        user.setUserpw("testpassword");
        user.setUsername("테스트사용자");
        user.setAddr("테스트 주소");
        user.setEmail1("test");
        user.setEmail2("example.com");
        user.setTel1("010");
        user.setTel2("1234");
        user.setTel3("5678");
        user.setZipcode(12345);
        user.setAddrdetail("상세주소");
        userRepository.save(user);

        // EventEntity 생성 및 저장
        EventEntity event1 = new EventEntity();
        event1.setSubject("이벤트 제목 1");
        event1.setContent("이벤트 내용 1");
        event1.setCategory(BoardCategory.EVENT);
        event1.setUser(user);
        boardRepository.save(event1);

        EventEntity event2 = new EventEntity();
        event2.setSubject("공지사항 제목 1");
        event2.setContent("공지사항 내용 1");
        event2.setCategory(BoardCategory.NOTICE);
        event2.setUser(user);
        boardRepository.save(event2);

        System.out.println(
                "Transaction active: " + TransactionSynchronizationManager.isActualTransactionActive()
        ); // 트랜잭션 활성 상태 출력
    }

    @Test
    void findByCategory_ShouldReturnEventsOfGivenCategory() {
        // Given (테스트 데이터는 setUp에서 이미 추가됨)

        // When
        Pageable pageable = PageRequest.of(0, 10);
        Page<EventEntity> eventPage = boardRepository.findByCategory(BoardCategory.EVENT, pageable);

        // Then
        assertThat(eventPage).isNotNull();
        assertThat(eventPage.getContent()).isNotEmpty();
        assertThat(eventPage.getContent().get(0).getCategory()).isEqualTo(BoardCategory.EVENT);
    }

    @Test
    void findByCategory_ShouldReturnEmptyPage_WhenNoEventsForGivenCategory() {
        // Given (테스트 데이터는 setUp에서 이미 추가됨)

        // When
        Pageable pageable = PageRequest.of(0, 10);
        Page<EventEntity> eventPage = boardRepository.findByCategory(BoardCategory.FAQ, pageable); // FAQ로 변경

        // Then
        assertThat(eventPage).isNotNull();
        assertThat(eventPage.getContent()).isEmpty();
    }
}