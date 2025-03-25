package com.ke.serv.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "file_entity") // 테이블 이름 수정
@EntityListeners(AuditingEntityListener.class) // Auditing 활성화
public class FileEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id") // 컬럼 이름 수정 (선택 사항)
    private Long id; // Long 타입으로 변경 (선택 사항, int도 가능)

    @Column(nullable = false)
    private String fileName; // 서버에 저장되는 파일 이름

    @Column(nullable = false, length = 50) // length 적절히 조절
    private String fileExt;    // 확장자 명

    @Column(nullable = false)
    private long fileSize; // long 타입으로 변경

    @Column(nullable = false)
    private String fileUrl; // URL (또는 상대 경로)

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩
    @JoinColumn(name = "board_id") // 외래 키 컬럼 이름 (EventEntity 테이블의 기본 키 컬럼)
    @JsonBackReference // ✅ @JsonBackReference 추가!
    private EventEntity event;   //어떤 게시글의 파일인지

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdDate; // 생성 날짜

    @LastModifiedDate
    private LocalDateTime modifiedDate; // 수정 날짜

    // 선택 사항 (필요에 따라 추가)
    @Column
    private String originalFileName; // 원래 파일 이름

    @Column
    private String contentType; // MIME 타입 (예: image/jpeg)

    @Column(nullable = false, length = 255)
    private String extName; // ext_name 필드 추가

    @Column // ✅ filePath 필드 추가
    private String filePath; // 파일 시스템 상의 실제 파일 경로
}