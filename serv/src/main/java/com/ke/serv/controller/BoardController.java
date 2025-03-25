// BoardController.java
package com.ke.serv.controller;

import com.ke.serv.entity.EventEntity;
import com.ke.serv.entity.EventEntity.BoardCategory;
import com.ke.serv.service.BoardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.security.MessageDigest; // ✅ MessageDigest import 추가
import java.security.NoSuchAlgorithmException; // ✅ NoSuchAlgorithmException import 추가
import java.nio.charset.StandardCharsets; // StandardCharsets import 추가
import java.math.BigInteger; // BigInteger import 추가
import org.json.JSONArray; // ✅ JSONArray import
import org.json.JSONException; // ✅ JSONException import
import java.util.ArrayList; //import


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/boardPage")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> boardPage(
            @RequestParam(defaultValue = "EVENT") BoardCategory category,
            @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchTerm) {

        // 상세 로깅 추가
        System.out.println("📢 요청 파라미터:");
        System.out.println("- category: " + category);
        System.out.println("- page: " + pageable.getPageNumber());
        System.out.println("- size: " + pageable.getPageSize());
        System.out.println("- searchType: " + searchType);
        System.out.println("- searchTerm: " + searchTerm);

        Page<EventEntity> boardPage = boardService.getBoardList(category, pageable, searchType, searchTerm);

        Map<String, Object> response = new HashMap<>();
        response.put("list", boardPage.getContent());
        response.put("page", boardPage.getNumber());
        response.put("totalPages", boardPage.getTotalPages());
        response.put("totalElements", boardPage.getTotalElements());

        System.out.println("✅ 응답 데이터:");
        System.out.println("- 총 페이지 수: " + boardPage.getTotalPages());
        System.out.println("- 총 항목 수: " + boardPage.getTotalElements());
        System.out.println("- 현재 페이지 항목 수: " + boardPage.getContent().size());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/eventWriteOk")
    @Transactional
    public ResponseEntity<String> eventWriteOk(
            @RequestParam(value = "event_id", required = false) Integer eventId,
            @RequestParam("event_title") String title,
            @RequestParam("event_content") String content,
            @RequestParam(value = "event_startdate", required = false) String startDate,
            @RequestParam(value = "event_enddate", required = false) String endDate,
            @RequestParam(value = "mf", required = false) MultipartFile thumbnail,
            @RequestParam(value = "files", required = false) List<MultipartFile> contentImageFiles,
            @RequestParam("user_id") String userId,
            @RequestParam("category") BoardCategory category,
            @RequestParam(value = "password", required = false) String password, // ✅ 비밀번호 파라미터 추가
            HttpServletRequest request
    ) {
        try {
            // 디버깅 로그 추가 (기존 로그 유지)

            boardService.saveEvent(eventId, title, content, startDate, endDate, thumbnail, contentImageFiles, userId, category, password, request); // ✅ 비밀번호 파라미터 전달
            return ResponseEntity.ok(eventId == null ? "Event created successfully" : "Event updated successfully");
        } catch (IOException e) {
            System.err.println("게시글 저장 중 오류: " + e.getMessage());
            return ResponseEntity.status(500).body(eventId == null ? "Error creating event: " : "Error updating event: " + e.getMessage());
        } catch (Exception e) {
        e.printStackTrace(); // 서버 로그에 스택 트레이스 출력
        System.err.println("컨트롤러 처리 중 오류: " + e.getMessage());
        return ResponseEntity.status(500).body("서버 오류가 발생했습니다: " + e.getMessage());
    }
    }

    @GetMapping("/view/{id}") // ✅ 이 엔드포인트 추가!
    @Transactional(readOnly = false) // 🔥 변경
    public ResponseEntity<?> viewEvent(@PathVariable("id") int id) {
        Optional<EventEntity> eventOptional = boardService.getEvent(id); // 새로운 service 메소드 호출
        if (eventOptional.isPresent()) {
            return ResponseEntity.ok(eventOptional.get()); // event 가 있으면 200 OK 와 함께 event 정보 반환
        } else {
            return ResponseEntity.notFound().build(); // event 가 없으면 404 Not Found 반환
        }
    }

    @GetMapping("/view/edit/{id}") // ✅ 수정용 엔드포인트 추가!
    @Transactional(readOnly = true) // ✅ 읽기 전용 트랜잭션 적용 (수정 폼 조회)
    public ResponseEntity<?> editEvent(@PathVariable("id") int id) {
        Optional<EventEntity> eventOptional = boardService.getEvent(id); // 기존 getEvent 메소드 재활용
        if (eventOptional.isPresent()) {
            return ResponseEntity.ok(eventOptional.get()); // event 가 있으면 200 OK 와 함께 event 정보 반환
        } else {
            return ResponseEntity.notFound().build(); // event 가 없으면 404 Not Found 반환
        }
    }

    @DeleteMapping("/delete/{id}") // ✅ 삭제 엔드포인트 추가
    @CacheEvict(value = "boardPage", allEntries = true) // "boardPage" 라는 캐시를 모두 비움
    @Transactional // ✅ 쓰기 트랜잭션 적용 (삭제) - readOnly=false (기본값)
    public ResponseEntity<?> deleteEvent(@PathVariable("id") int id) {
        try {
            boardService.deleteEvent(id); // BoardService 에 삭제 로직 구현 필요
            return ResponseEntity.ok().build(); // 성공적으로 삭제되었을 경우 200 OK 반환
        } catch (Exception e) {
            // 삭제 실패 시 에러 처리 (예: 게시글이 없을 경우, 삭제 중 오류 발생 등)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 중 오류 발생: " + e.getMessage());
        }
    }

    @GetMapping("/inquiryView/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> viewInquiry(
            @PathVariable("id") int id,
            @RequestParam(value = "password", required = false) String password // ✅ 비밀번호를 선택적(optional) 파라미터로 변경
    ) {
        Optional<EventEntity> eventOptional;

        if (password == null) {
            eventOptional = boardService.getEvent(id); // ✅ 비밀번호 없이 조회 (관리자용)
        } else {
            eventOptional = boardService.getEventWithPasswordCheck(id, password); // ✅ 비밀번호 확인 후 조회
        }

        if (eventOptional.isPresent()) {
            return ResponseEntity.ok(eventOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다."); // ✅ 비밀번호 불일치 시 401 반환
        }
    }




    @DeleteMapping("/file/delete/{fileId}") // ✅ 파일 삭제 엔드포인트 수정 (PathVariable 타입 Long 으로 변경)
    @Transactional
    public ResponseEntity<?> deleteFile(@PathVariable Long fileId) { // ✅ @PathVariable int -> Long 으로 변경
        try {
            boardService.deleteFile(fileId); // BoardService 의 deleteFile 메소드 호출 (수정 불필요)
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 삭제 중 오류 발생: " + e.getMessage());
        }
    }

    @PostMapping("/eventUpdateOk")
    @Transactional
    public ResponseEntity<String> eventUpdateOk(
            @RequestParam("event_id") Integer eventId,
            @RequestParam("event_title") String title,
            @RequestParam("event_content") String content,
            @RequestParam(value = "event_startdate", required = false) String startDate,
            @RequestParam(value = "event_enddate", required = false) String endDate,
            @RequestParam(value = "mf", required = false) MultipartFile thumbnail,
            @RequestParam(value = "files", required = false) List<MultipartFile> contentImageFiles,
            @RequestParam("user_id") String userId,
            @RequestParam("category") BoardCategory category,
            @RequestParam(value = "password", required = false) String password,
            HttpServletRequest request
    ) {
        try {
            boardService.updateEvent(eventId, title, content, startDate, endDate, thumbnail, contentImageFiles, userId, category, password, request);
            return ResponseEntity.ok("Event updated successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error updating event: " + e.getMessage());
        }
    }

    // 기존 addReply 메서드 (수정)
    @PostMapping("/addReply/{id}")
    @Transactional
    public ResponseEntity<?> addReply(@PathVariable("id") int id, @RequestBody Map<String, String> requestBody) {
        String reply = requestBody.get("reply");
        String userId = requestBody.get("userId");

        if (reply == null || reply.trim().isEmpty() || userId == null || userId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("답변 내용 또는 사용자 ID가 비어있습니다.");
        }

        try {
            boardService.addReply(id, reply, userId);
            return ResponseEntity.ok("답변이 등록되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // 게시글 없음
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("답변 등록 중 오류 발생: " + e.getMessage());
        }
    }


    // 대화 목록 가져오기 (새 메서드 추가)
    @GetMapping("/conversation/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getConversation(@PathVariable("id") int id) {
        try {
            List<Map<String, Object>> conversation = boardService.getConversation(id);
            return ResponseEntity.ok(conversation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("대화 내용 조회 중 오류 발생: " + e.getMessage());
        }
    }

    // ✅ FAQ 수정 API 추가
    @PutMapping("/update/{id}")
    public ResponseEntity<EventEntity> updateBoard(@PathVariable Long id, @RequestBody EventEntity updatedBoard) {
        EventEntity board = boardService.findById(id);

        if (board == null) {
            return ResponseEntity.notFound().build();
        }

        //권한 검사
        if (!"admin1234".equals(board.getUser().getUserid())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        board.setSubject(updatedBoard.getSubject());
        board.setContent(updatedBoard.getContent());
        board.setModifiedDate(LocalDateTime.now());

        EventEntity savedBoard = boardService.update(board);
        return ResponseEntity.ok(savedBoard);
    }
}