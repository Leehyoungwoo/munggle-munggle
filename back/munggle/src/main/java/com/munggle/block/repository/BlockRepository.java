package com.munggle.block.repository;

import com.munggle.domain.model.entity.Block;
import com.munggle.domain.model.entity.BlockId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlockRepository extends JpaRepository<Block, BlockId> {

    List<Block> findByBlockFromIdAndIsBlockedTrue(Long id);
}
