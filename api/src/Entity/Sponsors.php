<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Serializer\Filter\GroupFilter;
use ApiPlatform\Serializer\Filter\PropertyFilter;
use App\Controller\FileController;
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

#[ApiFilter(GroupFilter::class)]
#[ApiFilter(SearchFilter::class)]
#[ApiFilter(PropertyFilter::class)]
#[
    ApiResource(
        operations: [
            new GetCollection(),
            new Get(),
            new Post(),
            new Patch(),
            new Delete()
        ],
        normalizationContext: ['groups' => ['sponsor:read']]
    )
]
#[ORM\Entity(repositoryClass: SponsorsRepository::class)]
class Sponsors
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['sponsor:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'sponsors')]
    #[Groups(['sponsor:organization:read', 'sponsor:read'])]
    private ?Organization $organization = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['sponsor:read'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['sponsor:read'])]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column]
    #[Groups(['sponsor:read'])]
    private ?int $sponsorRank = null;

    #[ORM\Column]
    #[Groups(['sponsor:read'])]
    private ?float $price = null;

    #[ORM\ManyToOne(inversedBy: 'sponsors')]
    #[Groups(['sponsor:competition:read'])]
    private ?Competition $competition = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['sponsor:read'])]
    private ?string $destinationUrl = null;

    public function __construct() {
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

    public function getCompetition(): ?Competition
    {
        return $this->competition;
    }

    public function setCompetition(?Competition $competition): static
    {
        $this->competition = $competition;

        return $this;
    }

    public function getDestinationUrl(): ?string
    {
        return $this->destinationUrl;
    }

    public function setDestinationUrl(?string $destinationUrl): static
    {
        $this->destinationUrl = $destinationUrl;

        return $this;
    }
}
