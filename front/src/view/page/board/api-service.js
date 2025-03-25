import axios from "axios"

// API 기본 설정
const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// 이벤트 관련 API 서비스
export const EventService = {
  // 이벤트 목록 조회
  getEvents: (page = 0, size = 6, searchType = "", searchTerm = "", withImages = false) => {
    return API.get("/events", {
      params: { page, size, searchType, searchTerm, withImages },
    })
  },

  // 이벤트 상세 조회
  getEventById: (id) => {
    return API.get(`/events/${id}`)
  },

  // 이벤트 생성
  createEvent: (eventData, files) => {
    const formData = new FormData()
    formData.append("event", new Blob([JSON.stringify(eventData)], { type: "application/json" }))

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file)
      })
    }

    return API.post("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  // 이벤트 수정
  updateEvent: (id, eventData, files) => {
    const formData = new FormData()
    formData.append("event", new Blob([JSON.stringify(eventData)], { type: "application/json" }))

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file)
      })
    }

    return API.put(`/events/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  // 이벤트 삭제
  deleteEvent: (id) => {
    return API.delete(`/events/${id}`)
  },
}

export default {
  EventService,
}

