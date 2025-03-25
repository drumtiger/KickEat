// FileRepository.java
package com.ke.serv.repository;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // @Repository 추가!


import java.util.List;

@Repository // 추가
public interface FileRepository extends JpaRepository<FileEntity, Long> { // Long 또는 Integer (FileEntity의 id 타입)

    // 특정 EventEntity에 속하는 모든 FileEntity 찾기
    List<FileEntity> findByEvent(EventEntity event);

    //게시글 ID를 기준으로 모든 첨부 파일 가져오기
    //List<FileEntity> findByEventId(int boardId);

    //특정 게시글의 특정 파일만 가져오기
    //Optional<FileEntity> findByEventIdAndId(int boardId, Long fileId);
}