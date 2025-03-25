// EventEntity.java (전체 코드 - @Lob 어노테이션 제거)
package com.ke.serv.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // JsonIgnore 어노테이션 import 추가
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = "user")
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String subject;

    @Column(name = "content",  length = 1000000000) // ✅ content 필드에 @Column 어노테이션 확인
    private String content; // ✅ @Lob 어노테이션 제거!
    private int hit;

    @CreationTimestamp
    private LocalDateTime createDate;
    private LocalDateTime modifiedDate;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String password; // ✅ 비밀번호 필드 추가


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // 실제 컬럼 이름
    private UserEntity user;

    // CascadeType.ALL: EventEntity가 저장, 수정, 삭제될 때 FileEntity도 함께 처리
// orphanRemoval = true: EventEntity에서 FileEntity가 제거되면 DB에서도 삭제
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY) // LAZY 로 복원!
    @JsonManagedReference // ✅ @JsonManagedReference 추가!
    private List<FileEntity> files = new ArrayList<>();

    @Enumerated(EnumType.STRING) //추가
    private BoardCategory category; // 카테고리 필드

    // 파일 추가 헬퍼 메서드
    public void addFile(FileEntity file) {
        files.add(file);
        file.setEvent(this);
    }

    // 파일 삭제 헬퍼 메서드 (필요한 경우)
    public void removeFile(FileEntity file) {
        files.remove(file);
        file.setEvent(null);
    }

    public enum BoardCategory {
        EVENT, // 이벤트 게시판
        NOTICE, // 공지 게시판
        FAQ, // FAQ 게시판
        INQUIRY // 문의 게시판
    }
}