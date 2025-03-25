// BoardService.java
package com.ke.serv.service;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.FileEntity;
import com.ke.serv.entity.ReplyEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.repository.BoardRepository;
import com.ke.serv.repository.FileRepository;
import com.ke.serv.repository.ReplyRepository;
import com.ke.serv.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.util.*;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.math.BigInteger;

@Service
@RequiredArgsConstructor
@Slf4j
//@Transactional // 클래스 레벨 대신 메서드 레벨로 변경
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final FileRepository fileRepository;
    private final ReplyRepository replyRepository;

    @Value("${file.upload.path}")
    private String uploadPath;


    @Transactional(readOnly = true)
    public Page<EventEntity> getBoardList(BoardCategory category, Pageable pageable, String searchType, String searchTerm) {
        Page<EventEntity> boardPage;

        try {
            if (StringUtils.hasText(searchTerm)) {
                String keyword = searchTerm.trim();
                log.info("검색 조건: category={}, searchType={}, keyword={}", category, searchType, keyword);

                if ("제목내용".equals(searchType)) {
                    boardPage = boardRepository.findByCategoryAndSubjectContainingIgnoreCaseOrContentContainingIgnoreCase(
                            category, keyword, pageable);
                } else if ("제목만".equals(searchType)) {
                    boardPage = boardRepository.findByCategoryAndSubjectContainingIgnoreCase(
                            category, keyword, pageable);
                } else if ("작성자".equals(searchType)) {
                    log.info("작성자 검색: category={}, keyword={}", category, keyword);
                    boardPage = boardRepository.searchByCategoryAndUserId(
                            category, keyword, pageable);
                } else {
                    log.warn("알 수 없는 검색 타입: {}", searchType);
                    boardPage = boardRepository.findByCategory(category, pageable);
                }
            } else {
                log.info("전체 목록 조회: category={}", category);
                boardPage = boardRepository.findByCategory(category, pageable);
            }

            log.info("조회 결과: totalElements={}, totalPages={}", 
                    boardPage.getTotalElements(), boardPage.getTotalPages());
            return boardPage;

        } catch (Exception e) {
            log.error("게시글 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("게시글 목록을 조회하는 중 오류가 발생했습니다.", e);
        }
    }

    @Transactional
    public void saveEvent(Integer eventId, String title, String content, String startDate, String endDate,
                          MultipartFile thumbnail, List<MultipartFile> contentImageFiles, String userId, BoardCategory category, String password,
                          HttpServletRequest request) throws IOException {

        UserEntity user = userRepository.findByUserid(userId);
        if (user == null) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }

        EventEntity event;
        List<FileEntity> existingFiles = new ArrayList<>();

        if (eventId != null) {
            Optional<EventEntity> existingEventOptional = boardRepository.findById(eventId);
            if (existingEventOptional.isPresent()) {
                event = existingEventOptional.get();
                event.setModifiedDate(LocalDateTime.now());
                existingFiles = event.getFiles();
                event.getFiles().clear();

                if (thumbnail != null && !thumbnail.isEmpty()) {
                    FileEntity oldThumbnail = existingFiles.stream()
                            .filter(file -> file.getContentType() != null && file.getContentType().startsWith("image/"))
                            .findFirst().orElse(null);

                    if (oldThumbnail != null) {
                        deleteLocalFile(oldThumbnail); // 로컬 파일 삭제 추가
                        fileRepository.delete(oldThumbnail);
                    }
                }


            } else {
                throw new IllegalArgumentException("Event not found with ID: " + eventId);
            }
        } else {
            event = new EventEntity();
        }

        event.setSubject(title);
        event.setContent(content);
        event.setCategory(category);
        event.setUser(user);
        if (category == BoardCategory.INQUIRY && password != null && !password.isEmpty()) {
            event.setPassword(hashPassword(password)); // SHA-256 hash
        } else {
            event.setPassword(null);
        }


        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        if (startDate != null && !startDate.isEmpty()) {
            event.setStartDate(LocalDateTime.parse(startDate, formatter));
        }
        if (endDate != null && !endDate.isEmpty()) {
            event.setEndDate(LocalDateTime.parse(endDate, formatter));
        }

        List<FileEntity> newFiles = new ArrayList<>();

        EventEntity new_e = boardRepository.save(event);

        if (thumbnail != null && !thumbnail.isEmpty()) {
            FileEntity thumbnailFile = saveUploadedFile(thumbnail, new_e, new_e.getId(), request);
            newFiles.add(thumbnailFile);
        } else if (eventId != null) {
            FileEntity oldThumbnail = existingFiles.stream()
                    .filter(file -> file.getContentType() != null && file.getContentType().startsWith("image/"))
                    .findFirst().orElse(null);
            if(oldThumbnail != null){
                newFiles.add(oldThumbnail);
            }
        }


        if (contentImageFiles != null && !contentImageFiles.isEmpty()) {
            for (MultipartFile file : contentImageFiles) {
                if (!file.isEmpty()) {
                    FileEntity fileEntity = saveUploadedFile(file, new_e, new_e.getId(), request);
                    newFiles.add(fileEntity);
                }
            }
        }
    }


    private FileEntity saveUploadedFile(MultipartFile file, EventEntity event, int boardId, HttpServletRequest request) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String fileName = boardId + "_" + System.currentTimeMillis() + "_" + originalFilename;
        String fileExt = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        long fileSize = file.getSize();
//        Path filePath = Paths.get(uploadPath, String.valueOf(boardId), fileName);
        Path filePath = Paths.get(request.getServletContext().getRealPath("/uploads/board"), String.valueOf(boardId), fileName);

        Files.createDirectories(filePath.getParent());

        Files.write(filePath, file.getBytes());

        String fileUrl = "/uploads/board/" + boardId + "/" + fileName;

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(fileName);
        fileEntity.setFileExt(fileExt);
        fileEntity.setFileSize(fileSize);
        fileEntity.setFileUrl(fileUrl);
        fileEntity.setEvent(event);
        fileEntity.setOriginalFileName(originalFilename);
        fileEntity.setContentType(file.getContentType());
        fileEntity.setExtName(fileExt);
        fileEntity.setFilePath(filePath.toString()); // 파일 경로 저장

        return fileRepository.save(fileEntity);
    }

    @Transactional
    public Optional<EventEntity> getEvent(int id) {
        Optional<EventEntity> eventOptional = boardRepository.findById(id);

        if (eventOptional.isPresent()) {
            EventEntity event = eventOptional.get();

            event.setHit(event.getHit() + 1);
            boardRepository.save(event);

            UserEntity user = event.getUser();
            if (user != null) {
                userRepository.findByUserid(user.getUserid());
            }

            List<FileEntity> files = fileRepository.findByEvent(event);
            files.forEach(file -> {
                String fileUrl = "/uploads/board/" + file.getFileName().substring(0, file.getFileName().indexOf("_")) + "/" + file.getFileName();
                file.setFileUrl(fileUrl);
            });
            event.setFiles(files);

            return Optional.of(event);
        }
        return Optional.empty();
    }

    private boolean isThumbnailUpdated(HttpServletRequest request) {
        return false;
    }

    @Transactional
    public void deleteEvent(int id) {
        log.info("deleteEvent 메서드 시작 - Event ID: {}", id);

        Optional<EventEntity> eventOptional = boardRepository.findById(id);
        if (eventOptional.isPresent()) {
            EventEntity event = eventOptional.get();

            log.info("EventEntity 찾음 - ID: {}, Subject: {}", event.getId(), event.getSubject());

            // **** 아래 두 줄이 ReplyEntity 삭제를 위해 추가된 핵심 코드 ****
            List<ReplyEntity> replies = replyRepository.findByEventOrderByCreateDateAsc(event);
            log.info("삭제할 ReplyEntity 수: {}", replies.size());
            replyRepository.deleteAll(replies); // ReplyEntity 일괄 삭제

            try {
                List<FileEntity> files = fileRepository.findByEvent(event);
                log.info("첨부 파일 목록 조회 - 파일 수: {}", files.size());
                for (FileEntity file : files) {
                    try {
                        deleteLocalFile(file); // 로컬 파일 삭제
                        fileRepository.delete(file); // DB 삭제
                        log.info("FileEntity 삭제 성공 - File ID: {}", file.getId());
                    } catch (Exception fileDeleteEx) {
                        log.error("FileEntity 삭제 중 오류 발생 - File ID: {}", file.getId(), fileDeleteEx);
                        throw fileDeleteEx;
                    }
                }
            } catch (Exception fileLoopEx) {
                log.error("첨부 파일 삭제 루프 전체 오류 발생", fileLoopEx);
                throw fileLoopEx;
            }


            try {
                log.info("boardRepository.delete(event) 호출 전 - Event ID: {}", event.getId());
                boardRepository.delete(event);
                log.info("boardRepository.delete(event) 호출 후 - Event ID: {}", event.getId());
                log.info("EventEntity 삭제 성공 - Event ID: {}", event.getId());
            } catch (Exception boardDeleteEx) {
                log.error("boardRepository.delete(event) 삭제 중 오류 발생 - Event ID: {}", event.getId(), boardDeleteEx);
                throw boardDeleteEx;
            }


        } else {
            log.warn("삭제할 EventEntity 없음 - Event ID: {}", id);
            throw new IllegalArgumentException("Event not found with ID: " + id);
        }
        log.info("deleteEvent 메서드 종료 - Event ID: {}", id);
    }

    private void deleteLocalFile(FileEntity fileEntity) {
        if (fileEntity.getFilePath() != null) { // 파일 경로가 null이 아닌 경우에만 삭제 시도
            Path filePath = Paths.get(fileEntity.getFilePath());
            File localFile = filePath.toFile();
            if (localFile.exists()) {
                if (localFile.delete()) {
                    log.info("로컬 파일 삭제 성공 - Path: {}", fileEntity.getFilePath());
                } else {
                    log.error("로컬 파일 삭제 실패 - Path: {}", fileEntity.getFilePath());
                    throw new RuntimeException("로컬 파일 삭제 실패: " + fileEntity.getFilePath());
                }
            } else {
                log.warn("로컬 파일이 존재하지 않음 - Path: {}", fileEntity.getFilePath());
            }
        } else {
            log.warn("FileEntity에 파일 경로 정보가 없어 로컬 파일 삭제 생략 - File ID: {}", fileEntity.getId());
        }
    }


    @Transactional
    public void updateHitCount(int id) {
        boardRepository.incrementHitCount(id);
    }


    @Transactional(readOnly = true)
    public Optional<EventEntity> getEventWithPasswordCheck(int id, String password) {
        Optional<EventEntity> eventOptional = boardRepository.findById(id);

        if (eventOptional.isPresent()) {
            EventEntity event = eventOptional.get();

            if (event.getCategory() != BoardCategory.INQUIRY || event.getPassword() == null) {
                return Optional.of(event);
            }

            if (checkPassword(password, event.getPassword())) {
                event.setHit(event.getHit() + 1);
                boardRepository.save(event);

                UserEntity user = event.getUser();
                if (user != null) {
                    userRepository.findByUserid(user.getUserid());
                }

                List<FileEntity> files = fileRepository.findByEvent(event);
                files.forEach(file -> {
                    String fileUrl = "/uploads/" + file.getFileName().substring(0, file.getFileName().indexOf("_")) + "/" + file.getFileName();
                    file.setFileUrl(fileUrl);
                });
                event.setFiles(files);

                return Optional.of(event);
            } else {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }


    // ✅ SHA-256 해시 함수
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    // ✅ SHA-256 해시값 비교 함수
    private boolean checkPassword(String inputPassword, String hashedPassword) {
        String hashedInputPassword = hashPassword(inputPassword);
        return hashedInputPassword != null && hashedInputPassword.equals(hashedPassword);
    }


    // ✅ byte[] to hex string 변환 함수
    private String bytesToHex(byte[] hash) {
        BigInteger number = new BigInteger(1, hash);
        StringBuilder hexString = new StringBuilder(number.toString(16));
        while (hexString.length() < 32) {
            hexString.insert(0, '0');
        }
        return hexString.toString();
    }

    public void deleteFile(Long fileId) { // ✅ 파일 삭제 메소드 구현 (인터페이스 구현 제거), fileId 타입 Long 유지
        Optional<FileEntity> fileOptional = fileRepository.findById(fileId);

        if (fileOptional.isPresent()) {
            FileEntity fileEntity = fileOptional.get();

            // 1. 실제 파일 스토리지에서 파일 삭제
            deleteLocalFile(fileEntity);


            // 2. 데이터베이스에서 파일 정보 삭제
            fileRepository.deleteById(fileId);

        } else {
            throw new IllegalArgumentException("파일을 찾을 수 없습니다.");
        }
    }
    private void setFileUrls(EventEntity event) {
        if (event == null || event.getFiles() == null) {
            return;
        }
        event.getFiles().forEach(file -> {
            // 파일 이름에서 boardId + "_" + 타임스탬프 + "_" 부분을 제거할 필요가 없습니다.
            // DB에 저장된 파일 이름을 그대로 사용하되, boardId 대신 event.getId()를 사용합니다.
            String fileUrl = "/uploads/board/" + event.getId() + "/" + file.getFileName();

            file.setFileUrl(fileUrl);
        });
    }

    @Transactional
    public void updateEvent(Integer eventId, String title, String content, String startDate, String endDate,
                            MultipartFile thumbnail, List<MultipartFile> contentImageFiles, String userId,
                            BoardCategory category, String password, HttpServletRequest request) throws IOException {

        UserEntity user = userRepository.findByUserid(userId);
        if (user == null) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }

        // 1. 기존 EventEntity 로드
        Optional<EventEntity> existingEventOptional = boardRepository.findById(eventId);
        if (!existingEventOptional.isPresent()) {
            throw new IllegalArgumentException("Event not found with ID: " + eventId);
        }
        EventEntity event = existingEventOptional.get();
        event.setModifiedDate(LocalDateTime.now());

        // 2. 기존 파일 가져오기
        List<FileEntity> existingFiles = fileRepository.findByEvent(event);

        // 3. **썸네일 처리 (새 썸네일이 있으면 기존 썸네일 삭제 후 교체)**
        if (thumbnail != null && !thumbnail.isEmpty()) {
            // 기존 썸네일 삭제
            existingFiles.stream()
                    .filter(file -> file.getContentType() != null && file.getContentType().startsWith("image/"))
                    .forEach(this::deleteFileEntity);

            // 새로운 썸네일 저장
            FileEntity thumbnailFile = saveUploadedFile(thumbnail, event, eventId, request);
            fileRepository.save(thumbnailFile);
        }

        // 4. **내용 이미지 처리 (새 이미지가 있으면 기존 이미지 삭제 후 교체)**
        if (contentImageFiles != null && !contentImageFiles.isEmpty()) {
            // 기존 내용 이미지 삭제
            existingFiles.stream()
                    .filter(file -> !file.getContentType().startsWith("image/"))  // 썸네일이 아닌 파일 삭제
                    .forEach(this::deleteFileEntity);

            // 새로운 내용 이미지 저장
            for (MultipartFile file : contentImageFiles) {
                if (!file.isEmpty()) {
                    FileEntity fileEntity = saveUploadedFile(file, event, eventId, request);
                    fileRepository.save(fileEntity);
                }
            }
        }

        // 5. 변경된 내용 저장
        event.setSubject(title);
        event.setContent(content);
        event.setCategory(category);
        event.setUser(user);

        if (category == BoardCategory.INQUIRY && password != null && !password.isEmpty()) {
            event.setPassword(hashPassword(password));
        } else {
            event.setPassword(null);
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        if (startDate != null && !startDate.isEmpty()) {
            event.setStartDate(LocalDateTime.parse(startDate, formatter));
        }
        if (endDate != null && !endDate.isEmpty()) {
            event.setEndDate(LocalDateTime.parse(endDate, formatter));
        }

        boardRepository.save(event);
    }

    // ✅ 글 수정 시 파일 저장 (saveUploadedFileUpdate) - 새로 추가
    private FileEntity saveUploadedFileUpdate(MultipartFile file, EventEntity event, HttpServletRequest request) throws IOException {
        // 파일 이름 생성 로직 (boardId 사용 안 함, eventId 사용)
        String originalFilename = file.getOriginalFilename();
        String fileName =  System.currentTimeMillis() + "_" + originalFilename; // boardId 사용 안함
        String fileExt = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        long fileSize = file.getSize();

        // 상대 경로 사용
        Path filePath = Paths.get("uploads/board", String.valueOf(event.getId()), fileName); // event.getId() 사용

        // 디렉터리가 없으면 생성
        Files.createDirectories(filePath.getParent());

        // 파일 저장
        Files.write(filePath, file.getBytes());

        // 파일 URL 생성
        String fileUrl = "/uploads/board/" + event.getId() + "/" + fileName;  // event.getId() 사용

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(fileName);
        fileEntity.setFileExt(fileExt);
        fileEntity.setFileSize(fileSize);
        fileEntity.setFileUrl(fileUrl);
        fileEntity.setEvent(event);
        fileEntity.setOriginalFileName(originalFilename);
        fileEntity.setContentType(file.getContentType());
        fileEntity.setExtName(fileExt);
        fileEntity.setFilePath(filePath.toString()); // 상대 경로

        return fileRepository.save(fileEntity);
    }

//    // ✅ 파일 일괄 삭제 (deleteFiles) - 기존 코드 유지 (필요에 따라)
//    @Transactional
//    public void deleteFiles(List<Long> fileIds) {
//        for (Long fileId : fileIds) {
//            Optional<FileEntity> fileOptional = fileRepository.findById(fileId);
//            if (fileOptional.isPresent()) {
//                FileEntity fileEntity = fileOptional.get();
//                deleteLocalFile(fileEntity);
//                fileRepository.delete(fileEntity);
//            }
//        }
//    }

    private void deleteFileEntity(FileEntity fileEntity) {
        deleteLocalFile(fileEntity);  // 로컬 파일 삭제
        fileRepository.delete(fileEntity);  // DB에서 삭제
    }

    @Transactional
    public void addReply(int eventId, String reply, String userId) {
        Optional<EventEntity> eventOptional = boardRepository.findById(eventId);
        if (!eventOptional.isPresent()) {
            throw new IllegalArgumentException("해당 ID의 문의글을 찾을 수 없습니다: " + eventId);
        }
        EventEntity event = eventOptional.get();

        UserEntity user = userRepository.findByUserid(userId);

        if(user == null){
            throw new IllegalArgumentException("해당 ID의 사용자를 찾을 수 없습니다: " + userId);
        }

        // 답변 객체 생성 및 저장 (별도의 엔티티 사용)
        ReplyEntity replyEntity = new ReplyEntity();
        replyEntity.setContent(reply);
        replyEntity.setUser(user);
        replyEntity.setEvent(event);
        replyEntity.setCreateDate(LocalDateTime.now());
        replyRepository.save(replyEntity); // ReplyRepository 필요!
    }

    // 대화 목록 가져오기 (새 메서드)
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getConversation(int eventId) {
        Optional<EventEntity> eventOptional = boardRepository.findById(eventId);
        if (!eventOptional.isPresent()) {
            throw new IllegalArgumentException("해당 ID의 문의글을 찾을 수 없습니다: " + eventId);
        }
        EventEntity event = eventOptional.get();


        List<Map<String, Object>> conversation = new ArrayList<>();

        // 문의글 정보 추가
        Map<String, Object> inquiryInfo = new HashMap<>();
        inquiryInfo.put("content", event.getContent());
        inquiryInfo.put("userId", event.getUser().getUserid());
        inquiryInfo.put("createDate", event.getCreateDate());
        inquiryInfo.put("isAdmin", event.getUser().getUserid().equals("admin1234"));
        conversation.add(inquiryInfo);


        // 모든 답변 가져오기
        List<ReplyEntity> replies = replyRepository.findByEventOrderByCreateDateAsc(event);  // ReplyRepository 사용
        for (ReplyEntity reply : replies) {
            Map<String, Object> replyInfo = new HashMap<>();
            replyInfo.put("content", reply.getContent());
            replyInfo.put("userId", reply.getUser().getUserid());
            replyInfo.put("createDate", reply.getCreateDate());
            replyInfo.put("isAdmin", reply.getUser().getUserid().equals("admin1234")); // 관리자 여부
            conversation.add(replyInfo);
        }

        return conversation;
    }
    public List<EventEntity> getEventByDate(BoardCategory category){
        return boardRepository.findAllByCategoryOrderByStartDateAsc(category);
    }

    // ✅ findById 메서드 추가
    public EventEntity findById(Long id) {
        Optional<EventEntity> optionalBoard = boardRepository.findById(Math.toIntExact(id));
        return optionalBoard.orElse(null);
    }

    // ✅ update 메서드 추가
    public EventEntity update(EventEntity board) {
        return boardRepository.save(board);
    }
}