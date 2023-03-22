<?php

namespace App\Entity;

use App\Repository\MemberRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MemberRepository::class)]
#[ORM\Table(name: '`member`')]
class Member
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $state = null;

    #[ORM\Column(length: 255)]
    private ?string $pseudonym = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $registration_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $delete_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $update_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $last_connection_date = null;

    #[ORM\Column(length: 255)]
    private ?string $picture_profil = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $photographer_description = null;

    #[ORM\Column(length: 255)]
    private ?string $website_url = null;

    #[ORM\Column(length: 255)]
    private ?string $socials_networks = null;

    #[ORM\ManyToOne(inversedBy: 'members')]
    private ?PersonnalStatut $Personnal_statut = null;

    #[ORM\ManyToOne(inversedBy: 'members')]
    private ?PhotographerCategory $photographer_category = null;

    #[ORM\OneToMany(mappedBy: 'member_id', targetEntity: Picture::class)]
    private Collection $pictures;

    #[ORM\OneToMany(mappedBy: 'member_id', targetEntity: Vote::class)]
    private Collection $votes;

    #[ORM\OneToMany(mappedBy: 'member_id', targetEntity: MemberOfTheJury::class)]
    private Collection $memberOfTheJuries;

    public function __construct()
    {
        $this->pictures = new ArrayCollection();
        $this->votes = new ArrayCollection();
        $this->memberOfTheJuries = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isState(): ?bool
    {
        return $this->state;
    }

    public function setState(bool $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getPseudonym(): ?string
    {
        return $this->pseudonym;
    }

    public function setPseudonym(string $pseudonym): self
    {
        $this->pseudonym = $pseudonym;

        return $this;
    }

    public function getRegistrationDate(): ?\DateTimeInterface
    {
        return $this->registration_date;
    }

    public function setRegistrationDate(\DateTimeInterface $registration_date): self
    {
        $this->registration_date = $registration_date;

        return $this;
    }

    public function getDeleteDate(): ?\DateTimeInterface
    {
        return $this->delete_date;
    }

    public function setDeleteDate(\DateTimeInterface $delete_date): self
    {
        $this->delete_date = $delete_date;

        return $this;
    }

    public function getUpdateDate(): ?\DateTimeInterface
    {
        return $this->update_date;
    }

    public function setUpdateDate(\DateTimeInterface $update_date): self
    {
        $this->update_date = $update_date;

        return $this;
    }

    public function getLastConnectionDate(): ?\DateTimeInterface
    {
        return $this->last_connection_date;
    }

    public function setLastConnectionDate(\DateTimeInterface $last_connection_date): self
    {
        $this->last_connection_date = $last_connection_date;

        return $this;
    }

    public function getPictureProfil(): ?string
    {
        return $this->picture_profil;
    }

    public function setPictureProfil(string $picture_profil): self
    {
        $this->picture_profil = $picture_profil;

        return $this;
    }

    public function getPhotographerDescription(): ?string
    {
        return $this->photographer_description;
    }

    public function setPhotographerDescription(string $photographer_description): self
    {
        $this->photographer_description = $photographer_description;

        return $this;
    }

    public function getWebsiteUrl(): ?string
    {
        return $this->website_url;
    }

    public function setWebsiteUrl(string $website_url): self
    {
        $this->website_url = $website_url;

        return $this;
    }

    public function getSocialsNetworks(): ?string
    {
        return $this->socials_networks;
    }

    public function setSocialsNetworks(string $socials_networks): self
    {
        $this->socials_networks = $socials_networks;

        return $this;
    }

    public function getPersonnalStatut(): ?PersonnalStatut
    {
        return $this->Personnal_statut;
    }

    public function setPersonnalStatut(?PersonnalStatut $Personnal_statut): self
    {
        $this->Personnal_statut = $Personnal_statut;

        return $this;
    }

    public function getPhotographerCategory(): ?PhotographerCategory
    {
        return $this->photographer_category;
    }

    public function setPhotographerCategory(?PhotographerCategory $photographer_category): self
    {
        $this->photographer_category = $photographer_category;

        return $this;
    }

    /**
     * @return Collection<int, Picture>
     */
    public function getPictures(): Collection
    {
        return $this->pictures;
    }

    public function addPicture(Picture $picture): self
    {
        if (!$this->pictures->contains($picture)) {
            $this->pictures->add($picture);
            $picture->setMember($this);
        }

        return $this;
    }

    public function removePicture(Picture $picture): self
    {
        if ($this->pictures->removeElement($picture)) {
            // set the owning side to null (unless already changed)
            if ($picture->getMember() === $this) {
                $picture->setMember(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Vote>
     */
    public function getVotes(): Collection
    {
        return $this->votes;
    }

    public function addVote(Vote $vote): self
    {
        if (!$this->votes->contains($vote)) {
            $this->votes->add($vote);
            $vote->setMember($this);
        }

        return $this;
    }

    public function removeVote(Vote $vote): self
    {
        if ($this->votes->removeElement($vote)) {
            // set the owning side to null (unless already changed)
            if ($vote->getMember() === $this) {
                $vote->setMember(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, MemberOfTheJury>
     */
    public function getMemberOfTheJuries(): Collection
    {
        return $this->memberOfTheJuries;
    }

    public function addMemberOfTheJury(MemberOfTheJury $memberOfTheJury): self
    {
        if (!$this->memberOfTheJuries->contains($memberOfTheJury)) {
            $this->memberOfTheJuries->add($memberOfTheJury);
            $memberOfTheJury->setMember($this);
        }

        return $this;
    }

    public function removeMemberOfTheJury(MemberOfTheJury $memberOfTheJury): self
    {
        if ($this->memberOfTheJuries->removeElement($memberOfTheJury)) {
            // set the owning side to null (unless already changed)
            if ($memberOfTheJury->getMember() === $this) {
                $memberOfTheJury->setMember(null);
            }
        }

        return $this;
    }
}
