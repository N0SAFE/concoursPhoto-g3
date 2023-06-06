<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SponsorsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch()
    ],
    normalizationContext: ["groups" => ["sponsors:read"]],
)]
#[ORM\Entity(repositoryClass: SponsorsRepository::class)]
class Sponsors
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['sponsors:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'sponsors')]
    #[Groups(['sponsors:read'])]
    private ?Organization $organization = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['sponsors:read'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['sponsors:read'])]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column]
    #[Groups(['sponsors:read'])]
    private ?int $sponsorRank = null;

    #[ORM\Column]
    #[Groups(['sponsors:read'])]
    private ?float $price = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['sponsors:logo:read', 'user:current:read'])]
    private ?File $logo = null;

    #[ORM\ManyToMany(targetEntity: Competition::class, mappedBy: 'sponsors')]
    #[Groups(['sponsors:competitions:read'])]
    private Collection $competitions;

    public function __construct()
    {
        $this->competitions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrganization(): ?Organization
    {
        return $this->organization;
    }

    public function setOrganization(?Organization $organization): self
    {
        $this->organization = $organization;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): self
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getSponsorRank(): ?int
    {
        return $this->sponsorRank;
    }

    public function setSponsorRank(int $sponsorRank): self
    {
        $this->sponsorRank = $sponsorRank;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getLogo(): ?File
    {
        return $this->logo;
    }

    public function setLogo(?File $logo): self
    {
        $this->logo = $logo;

        return $this;
    }

    /**
     * @return Collection<int, Competition>
     */
    public function getCompetitions(): Collection
    {
        return $this->competitions;
    }

    public function addCompetition(Competition $competition): self
    {
        if (!$this->competitions->contains($competition)) {
            $this->competitions->add($competition);
            $competition->addSponsor($this);
        }

        return $this;
    }

    public function removeCompetition(Competition $competition): self
    {
        if ($this->competitions->removeElement($competition)) {
            $competition->removeSponsor($this);
        }

        return $this;
    }
}
