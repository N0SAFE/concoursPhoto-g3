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
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch()
    ],
    normalizationContext: ['groups' => ['advertisingSpace:read']],
)]
#[ORM\Entity(repositoryClass: AdvertisingSpaceRepository::class)]
class AdvertisingSpace
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['advertisingSpace:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['advertisingSpace:read'])]
    private ?bool $state = null;

    #[ORM\Column(length: 255)]
    #[Groups(['advertisingSpace:read'])]
    private ?string $locationName = null;

    #[ORM\Column]
    #[Groups(['advertisingSpace:read'])]
    private ?int $heightPx = null;

    #[ORM\Column]
    #[Groups(['advertisingSpace:read'])]
    private ?int $widthPx = null;

    #[ORM\Column]
    #[Groups(['advertisingSpace:read'])]
    private ?int $referencePrice = null;

    #[ORM\OneToMany(mappedBy: 'advertising', targetEntity: Rent::class)]
    #[Groups(['advertisingSpace:rents:read'])]
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
        return $this->locationName;
    }

    public function setLocationName(string $locationName): self
    {
        $this->locationName = $locationName;

        return $this;
    }

    public function getHeightPx(): ?int
    {
        return $this->heightPx;
    }

    public function setHeightPx(int $heightPx): self
    {
        $this->heightPx = $heightPx;

        return $this;
    }

    public function getWidthPx(): ?int
    {
        return $this->widthPx;
    }

    public function setWidthPx(int $widthPx): self
    {
        $this->widthPx = $widthPx;

        return $this;
    }

    public function getReferencePrice(): ?int
    {
        return $this->referencePrice;
    }

    public function setReferencePrice(int $referencePrice): self
    {
        $this->referencePrice = $referencePrice;

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
