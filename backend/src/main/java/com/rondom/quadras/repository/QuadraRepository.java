package com.rondom.quadras.repository;

import com.rondom.quadras.entities.QuadraEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuadraRepository extends JpaRepository<QuadraEntity, Long> {
}
