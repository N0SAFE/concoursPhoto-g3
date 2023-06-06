<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Serializer\Filter\GroupFilter;
use App\Repository\PictureRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[ApiFilter(
    GroupFilter::class
)]
#[ApiFilter(SearchFilter::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch()
    ],
    normalizationContext: ["groups" => ["picture:read"]],
)]
#[ORM\Entity(repositoryClass: PictureRepository::class)]
class Picture
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['picture:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['picture:read'])]
    private ?bool $state = null;

    #[ORM\Column(length: 255)]
    #[Groups(['picture:read'])]
    private ?string $pictureName = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['picture:read'])]
    private ?\DateTimeInterface $submissionDate = null;

    #[ORM\Column]
    #[Groups(['picture:read'])]
    private ?int $numberOfVotes = null;

    #[ORM\Column]
    #[Groups(['picture:read'])]
    private ?bool $priceWon = null;

    #[ORM\Column]
    #[Groups(['picture:read'])]
    private ?int $priceRank = null;

    #[Groups(['picture:votes:read'])]
    #[ORM\OneToMany(mappedBy: 'picture', targetEntity: Vote::class)]
    private Collection $votes;

    #[ORM\ManyToOne(inversedBy: 'pictures')]
    #[Groups(['picture:competition:read', 'user:current:read'])]
    private ?Competition $competition = null;

    #[ORM\ManyToOne(inversedBy: 'pictures')]
    #[Groups('picture:user:read')]
    private ?User $user = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups('picture:file:read')]
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
        return $this->pictureName;
    }

    public function setPictureName(string $pictureName): self
    {
        $this->pictureName = $pictureName;

        return $this;
    }

    public function getSubmissionDate(): ?\DateTimeInterface
    {
        return $this->submissionDate;
    }

    public function setSubmissionDate(\DateTimeInterface $submissionDate): self
    {
        $this->submissionDate = $submissionDate;

        return $this;
    }

    public function getNumberOfVotes(): ?int
    {
        return $this->numberOfVotes;
    }

    public function setNumberOfVotes(int $numberOfVotes): self
    {
        $this->numberOfVotes = $numberOfVotes;

        return $this;
    }

    public function isPriceWon(): ?bool
    {
        return $this->priceWon;
    }

    public function setPriceWon(bool $priceWon): self
    {
        $this->priceWon = $priceWon;

        return $this;
    }

    public function getPriceRank(): ?int
    {
        return $this->priceRank;
    }

    public function setPriceRank(int $priceRank): self
    {
        $this->priceRank = $priceRank;

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
	