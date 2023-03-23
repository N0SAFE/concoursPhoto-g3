<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PictureRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: PictureRepository::class)]
class Picture
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $state = null;

    #[ORM\Column(length: 255)]
    private ?string $picture_name = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $submission_date = null;

    #[ORM\Column(length: 255)]
    private ?string $file = null;

    #[ORM\Column]
    private ?int $number_of_votes = null;

    #[ORM\Column]
    private ?bool $price_won = null;

    #[ORM\Column]
    private ?int $price_rank = null;

    #[ORM\ManyToOne(inversedBy: 'pictures')]
    private ?Member $member = null;

    #[ORM\OneToMany(mappedBy: 'picture', targetEntity: Vote::class)]
    private Collection $votes;

    #[ORM\ManyToOne(inversedBy: 'pictures')]
    private ?Competition $competition = null;

    public function __construct()
    {
        $this->votes = new ArrayCollection();
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

    public function getPictureName(): ?string
    {
        return $this->picture_name;
    }

    public function setPictureName(string $picture_name): self
    {
        $this->picture_name = $picture_name;

        return $this;
    }

    public function getSubmissionDate(): ?\DateTimeInterface
    {
        return $this->submission_date;
    }

    public function setSubmissionDate(\DateTimeInterface $submission_date): self
    {
        $this->submission_date = $submission_date;

        return $this;
    }

    public function getFile(): ?string
    {
        return $this->file;
    }

    public function setFile(string $file): self
    {
        $this->file = $file;

        return $this;
    }

    public function getNumberOfVotes(): ?int
    {
        return $this->number_of_votes;
    }

    public function setNumberOfVotes(int $number_of_votes): self
    {
        $this->number_of_votes = $number_of_votes;

        return $this;
    }

    public function isPriceWon(): ?bool
    {
        return $this->price_won;
    }

    public function setPriceWon(bool $price_won): self
    {
        $this->price_won = $price_won;

        return $this;
    }

    public function getPriceRank(): ?int
    {
        return $this->price_rank;
    }

    public function setPriceRank(int $price_rank): self
    {
        $this->price_rank = $price_rank;

        return $this;
    }

    public function getMember(): ?Member
    {
        return $this->member;
    }

    public function setMember(?Member $member): self
    {
        $this->member = $member;

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
            $vote->setPicture($this);
        }

        return $this;
    }

    public function removeVote(Vote $vote): self
    {
        if ($this->votes->removeElement($vote)) {
            // set the owning side to null (unless already changed)
            if ($vote->getPicture() === $this) {
                $vote->setPicture(null);
            }
        }

        return $this;
    }

    public function getCompetition(): ?Competition
    {
        return $this->competition;
    }

    public function setCompetition(?Competition $competition): self
    {
        $this->competition = $competition;

        return $this;
    }
}