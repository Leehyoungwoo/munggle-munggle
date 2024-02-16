package com.munggle.domain.model.entity;

import com.munggle.image.dto.FileInfoDto;
import com.munggle.walk.dto.WalkUpdateDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.List;

@Entity
@Table(name = "walks")
@DynamicInsert
@DynamicUpdate
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Walk extends BaseTimeEntity {

    // 처음에는 유저번호, 산책 반려견만 채워진 채로 객체 생성
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walkId;

    private String walkName;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "dog_id")
    private Dog dog;

    @Size(max = 50)
    private String description;

    private Integer duration;
    private Integer distance;
    private Float rating;

    private String imageName;
    private String imageUrl;

    @Column(columnDefinition = "boolean default false")
    private Boolean isDeleted;

    @Column(columnDefinition = "boolean default false")
    private Boolean isPrivated;

    @OneToMany(mappedBy = "walk", cascade = CascadeType.REMOVE)
    private List<Location> location;

    public void setUser(User user){
        this.user = user;
    }

    public void setDog(Dog dog){
        this.dog = dog;
    }

    public void updateWalk(WalkUpdateDto walkUpdateDto){
        this.walkName = walkUpdateDto.getWalkName();
        this.description = walkUpdateDto.getDescription();
        this.rating = walkUpdateDto.getRating();
    }

    public void updateImage(FileInfoDto fileInfoDto){
        this.imageName = fileInfoDto.getFileName();
        this.imageUrl = fileInfoDto.getFileURL();
    }

    public void setDeleted(){
        this.isDeleted = true;
    }

    public void togglePrivated(){
        this.isPrivated = !this.isPrivated;
    }

}
