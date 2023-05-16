<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\AdvertisingSpaceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch()
    ]
)]
#[ORM\Entity(repositoryClass: AdvertisingSpaceRepository::class)]
class AdvertisingSpace
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $state = null;

    #[ORM\Column(length: 255)]
    private ?string $location_name = null;

    #[ORM\Column]
    private ?int $height_px = null;

    #[ORM\Column]
    private ?int $width_px = null;

    #[ORM\Column]
    private ?int $reference_price = null;

    #[ORM\OneToMany(mappedBy: 'advertising', targetEntity: Rent::class)]
    private Collection $rents;

    public function __construct()
    {
        $this->rents = new ArrayCollection();
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

    public function getLocationName(): ?string
    {
        return $this->location_name;
    }

    public function setLocationName(string $location_name): self
    {
        $this->location_name = $location_name;

        return $this;
    }

    public function getHeightPx(): ?int
    {
        return $this->height_px;
    }

    public function setHeightPx(int $height_px): self
    {
        $this->height_px = $height_px;

        return $this;
    }

    public function getWidthPx(): ?int
    {
        return $this->width_px;
    }

    public function setWidthPx(int $width_px): self
    {
        $this->width_px = $width_px;

        return $this;
    }

    public function getReferencePrice(): ?int
    {
        return $this->reference_price;
    }

    public function setReferencePrice(int $reference_price): self
    {
        $this->reference_price = $reference_price;

        return $this;
    }

    /**
     * @return Collection<int, Rent>
     */
    public function getRents(): Collection
    {
        return $this->rents;
    }

    public function addRent(Rent $rent): self
    {
        if (!$this->rents->contains($rent)) {
            $this->rents->add($rent);
            $rent->setAdvertising($this);
        }

        return $this;
    }

    public function removeRent(Rent $rent): self
    {
        if ($this->rents->removeElement($rent)) {
            // set the owning side to null (unless already changed)
            if ($rent->getAdvertising() === $this) {
                $rent->setAdvertising(null);
            }
        }

        return $this;
    }
}
