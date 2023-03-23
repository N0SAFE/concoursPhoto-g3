<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\RentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: RentRepository::class)]
class Rent
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $announcement_id = null;

    #[ORM\ManyToOne(inversedBy: 'rents')]
    private ?Organization $organization = null;

    #[ORM\ManyToOne(inversedBy: 'rents')]
    private ?AdvertisingSpace $advertising = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $start_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $end_date = null;

    #[ORM\Column(length: 255)]
    private ?string $url_click = null;

    #[ORM\Column(length: 255)]
    private ?string $alt_tag = null;

    #[ORM\Column]
    private ?int $price_sold = null;

    #[ORM\Column]
    private ?int $number_of_clicks = null;

    public function getId(): ?int
    {
        return $this->announcement_id;
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
        return $this->start_date;
    }

    public function setStartDate(\DateTimeInterface $start_date): self
    {
        $this->start_date = $start_date;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->end_date;
    }

    public function setEndDate(\DateTimeInterface $end_date): self
    {
        $this->end_date = $end_date;

        return $this;
    }

    public function getUrlClick(): ?string
    {
        return $this->url_click;
    }

    public function setUrlClick(string $url_click): self
    {
        $this->url_click = $url_click;

        return $this;
    }

    public function getAltTag(): ?string
    {
        return $this->alt_tag;
    }

    public function setAltTag(string $alt_tag): self
    {
        $this->alt_tag = $alt_tag;

        return $this;
    }

    public function getPriceSold(): ?int
    {
        return $this->price_sold;
    }

    public function setPriceSold(int $price_sold): self
    {
        $this->price_sold = $price_sold;

        return $this;
    }

    public function getNumberOfClicks(): ?int
    {
        return $this->number_of_clicks;
    }

    public function setNumberOfClicks(int $number_of_clicks): self
    {
        $this->number_of_clicks = $number_of_clicks;

        return $this;
    }
}
