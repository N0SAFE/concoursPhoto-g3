<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\RentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch()
    ],
    normalizationContext: ["groups" => ["rent:read"]],
)]
#[ORM\Entity(repositoryClass: RentRepository::class)]
class Rent
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rent:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'rents')]
    #[Groups(['rent:organization:read'])]
    private ?Organization $organization = null;

    #[ORM\ManyToOne(inversedBy: 'rents')]
    #[Groups(['rent:advertising:read'])]
    private ?AdvertisingSpace $advertising = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['rent:read'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['rent:read'])]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column(length: 255)]
    #[Groups(['rent:read'])]
    private ?string $urlClick = null;

    #[ORM\Column(length: 255)]
    #[Groups(['rent:read'])]
    private ?string $altTag = null;

    #[ORM\Column]
    #[Groups(['rent:read'])]
    private ?int $priceSold = null;

    #[ORM\Column]
    #[Groups(['rent:read'])]
    private ?int $numberOfClicks = null;

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

    public function getAdvertising(): ?AdvertisingSpace
    {
        return $this->advertising;
    }

    public function setAdvertising(?AdvertisingSpace $advertising): self
    {
        $this->advertising = $advertising;

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

    public function getUrlClick(): ?string
    {
        return $this->urlClick;
    }

    public function setUrlClick(string $urlClick): self
    {
        $this->urlClick = $urlClick;

        return $this;
    }

    public function getAltTag(): ?string
    {
        return $this->altTag;
    }

    public function setAltTag(string $altTag): self
    {
        $this->altTag = $altTag;

        return $this;
    }

    public function getPriceSold(): ?int
    {
        return $this->priceSold;
    }

    public function setPriceSold(int $priceSold): self
    {
        $this->priceSold = $priceSold;

        return $this;
    }

    public function getNumberOfClicks(): ?int
    {
        return $this->numberOfClicks;
    }

    public function setNumberOfClicks(int $numberOfClicks): self
    {
        $this->numberOfClicks = $numberOfClicks;

        return $this;
    }
}
