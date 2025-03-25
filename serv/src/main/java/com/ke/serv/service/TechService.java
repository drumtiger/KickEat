package com.ke.serv.service;


import com.ke.serv.entity.DmEntity;
import com.ke.serv.entity.UserEntity;
import com.ke.serv.repository.DmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TechService {
    private final DmRepository repo;

    public void insertDm(DmEntity entity){
        repo.save(entity);
    }
    public List<DmEntity> selectDmById(UserEntity user) {
        return repo.findAllByUserToOrderByIdDesc(user);
    }

    public DmEntity selectDm(DmEntity dm) {
        return repo.findById(dm.getId());
    }

    public void deleteMessageById(int id) {
        repo.deleteById(id);
    }

    public List<DmEntity> selectDmByReport(int i) {
        return repo.findAllByState(i);
    }
}
