package kr.co.realestate.domain.user.generated.model;

import jakarta.annotation.Generated;
import java.time.LocalDateTime;

public class Role {
    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    private Long id;

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    private String name;

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    private String description;

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    private LocalDateTime createdAt;

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    private LocalDateTime updatedAt;

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    private String createdBy;

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    private String updatedBy;

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public Long getId() {
        return id;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public void setId(Long id) {
        this.id = id;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public String getName() {
        return name;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public String getDescription() {
        return description;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public String getCreatedBy() {
        return createdBy;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy == null ? null : createdBy.trim();
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public String getUpdatedBy() {
        return updatedBy;
    }

    @Generated("org.mybatis.generator.api.MyBatisGenerator")
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy == null ? null : updatedBy.trim();
    }
}