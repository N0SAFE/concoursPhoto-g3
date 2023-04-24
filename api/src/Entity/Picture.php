<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PictureRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[ORM\Entity(repositoryClass: PictureRepository::class)]
class Picture
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    
    #[Groups(['competition', 'user:read'])]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $state = null;

    #[ORM\Column(length: 255)]
    #[Groups('competition')]
    private ?string $picture_name = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $submission_date = null;

    #[ORM\Column]
    private ?int $number_of_votes = null;

    #[ORM\Column]
    private ?bool $price_won = null;

    #[ORM\Column]
    private ?int $price_rank = null;

    #[Groups('competition')]
    #[ORM\OneToMany(mappedBy: 'picture', targetEntity: Vote::class)]
    private Collection $votes;

    #[ORM\ManyToOne(inversedBy: 'pictures')]
    #[Groups(['competition', 'user:read'])]
    private ?Competition $competition = null;

    #[ORM\ManyToOne(inversedBy: 'pictures')]
    #[Groups('competition')]
    private ?User $user = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups('competition')]
    private ?File $file = null;

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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getFile(): ?File
    {
        return $this->file;
    }

    public function setFile(?File $file): self
    {
        $this->file = $file;

        return $this;
    }
}
