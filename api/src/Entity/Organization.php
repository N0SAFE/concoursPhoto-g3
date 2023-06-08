<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use App\Repository\OrganizationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Serializer\Filter\PropertyFilter;
use ApiPlatform\Serializer\Filter\GroupFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

#[ApiFilter(PropertyFilter::class)]
#[ApiFilter(SearchFilter::class)]
#[ApiFilter(GroupFilter::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch(),
        new Delete()
    ],
    normalizationContext: ['groups' => ['organization:read']]
)]
#[ORM\Entity(repositoryClass: OrganizationRepository::class)]
class Organization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?bool $state = null;

    #[ORM\Column(length: 255)]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?string $organizerName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?string $address = null;

    #[ORM\Column]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?string $postcode = null;

    #[ORM\Column(length: 255)]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?string $citycode = null;

    #[ORM\Column(length: 255)]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?string $websiteUrl = null;

    #[ORM\Column(length: 255)]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?string $numberPhone = null;

    #[ORM\Column(length: 255)]
    #[Groups(['organization:read', 'user:current:read'])]
    private ?string $country = null;

    #[ORM\ManyToOne(inversedBy: 'organizations')]
    #[Groups(['organization:organizationType:read', 'user:current:read'])]
    private ?OrganizationType $organizationType = null;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'Manage')]
    #[Groups(['organization:admins:read', 'organization:admin:read'])]
    private Collection $admins;

    #[Groups(['organization:rents:read'])]
    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: Rent::class)]
    private Collection $rents;

    #[Groups(['organization:competitions:read', 'user:current:read'])]
    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: Competition::class)]
    private Collection $competitions;

    #[Groups(['organization:sponsors:read', 'user:current:read'])]
    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: Sponsors::class)]
    private Collection $sponsors;

    #[Groups(['organization:read', 'user:current:read'])]
    #[ORM\Column(length: 255)]
    private ?string $intraCommunityVat = null;

    #[Groups(['organization:read', 'user:current:read'])]
    #[ORM\Column(length: 255)]
    private ?string $numberSiret = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['organization:logo:read', 'user:current:read'])]
    private ?File $logo = null;

    #[Groups(['organization:organizationLinks:read'])]
    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: OrganizationLink::class)]
    private Collection $organizationLinks;

    #[Groups(['organization:read', 'user:current:read'])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $lastUpdateDate = null;

    #[Groups(['organization:organizationVisual:read', 'user:current:read'])]
    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?File $organizationVisual = null;

    public function __construct()
    {
        $this->admins = new ArrayCollection();
        $this->rents = new ArrayCollection();
        $this->competitions = new ArrayCollection();
        $this->sponsors = new ArrayCollection();
        $this->organizationLinks = new ArrayCollection();
    }

    #[Groups(['organization:read'])]
    public function getCompetitionCount(): int
    {
        return $this->competitions->count();
    }

    #[Groups(['organization:read'])]
    public function getActiveCompetitionCount(): int
    {
        $count = 0;
        foreach ($this->competitions as $competition) {
            if ($competition->getState() != 6) {
                $count++;
            }
        }
        return $count;
    }

    #[Groups(['organization:read'])]
    public function getRentCount(): int
    {
        return $this->rents->count();
    }

    #[Groups(['organization:read'])]
    public function getSponsorCount(): int
    {
        return $this->sponsors->count();
    }

    #[Groups(['organization:read'])]
    public function getAdminCount(): int
    {
        return $this->admins->count();
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

    public function getOrganizerName(): ?string
    {
        return $this->organizerName;
    }

    public function setOrganizerName(string $organizerName): self
    {
        $this->organizerName = $organizerName;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getPostcode(): ?string
    {
        return $this->postcode;
    }

    public function setPostcode(string $postcode): self
    {
        $this->postcode = $postcode;

        return $this;
    }

    public function getCitycode(): ?string
    {
        return $this->citycode;
    }

    public function setCitycode(string $citycode): self
    {
        $this->citycode = $citycode;

        return $this;
    }

    public function getWebsiteUrl(): ?string
    {
        return $this->websiteUrl;
    }

    public function setWebsiteUrl(string $websiteUrl): self
    {
        $this->websiteUrl = $websiteUrl;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getNumberPhone(): ?string
    {
        return $this->numberPhone;
    }

    public function setNumberPhone(string $numberPhone): self
    {
        $this->numberPhone = $numberPhone;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getOrganizationType(): ?OrganizationType
    {
        return $this->organizationType;
    }

    public function setOrganizationType(?OrganizationType $organizationType): self
    {
        $this->organizationType = $organizationType;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getAdmins(): Collection
    {
        return $this->admins;
    }

    public function addAdmins(User $user): self
    {
        if (!$this->admins->contains($user)) {
            $this->admins->add($user);
            $user->addManage($this);
        }

        return $this;
    }

    public function removeAdmin(User $user): self
    {
        if ($this->admins->removeElement($user)) {
            $user->removeManage($this);
        }

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
            $rent->setOrganization($this);
        }

        return $this;
    }

    public function removeRent(Rent $rent): self
    {
        if ($this->rents->removeElement($rent)) {
            // set the owning side to null (unless already changed)
            if ($rent->getOrganization() === $this) {
                $rent->setOrganization(null);
            }
        }

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
            $competition->setOrganization($this);
        }

        return $this;
    }

    public function removeCompetition(Competition $competition): self
    {
        if ($this->competitions->removeElement($competition)) {
            // set the owning side to null (unless already changed)
            if ($competition->getOrganization() === $this) {
                $competition->setOrganization(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Sponsors>
     */
    public function getSponsors(): Collection
    {
        return $this->sponsors;
    }

    public function addSponsor(Sponsors $sponsor): self
    {
        if (!$this->sponsors->contains($sponsor)) {
            $this->sponsors->add($sponsor);
            $sponsor->setOrganization($this);
        }

        return $this;
    }

    public function removeSponsor(Sponsors $sponsor): self
    {
        if ($this->sponsors->removeElement($sponsor)) {
            // set the owning side to null (unless already changed)
            if ($sponsor->getOrganization() === $this) {
                $sponsor->setOrganization(null);
            }
        }

        return $this;
    }

    public function getIntraCommunityVat(): ?string
    {
        return $this->intraCommunityVat;
    }

    public function setIntraCommunityVat(string $intraCommunityVat): self
    {
        $this->intraCommunityVat = $intraCommunityVat;

        return $this;
    }

    public function getNumberSiret(): ?string
    {
        return $this->numberSiret;
    }

    public function setNumberSiret(string $numberSiret): self
    {
        $this->numberSiret = $numberSiret;

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
     * @return Collection<int, OrganizationLink>
     */
    public function getOrganizationLinks(): Collection
    {
        return $this->organizationLinks;
    }

    public function addOrganizationLink(OrganizationLink $organizationLink): self
    {
        if (!$this->organizationLinks->contains($organizationLink)) {
            $this->organizationLinks->add($organizationLink);
            $organizationLink->setOrganization($this);
        }

        return $this;
    }

    public function removeOrganizationLink(OrganizationLink $organizationLink): self
    {
        if ($this->organizationLinks->removeElement($organizationLink)) {
            // set the owning side to null (unless already changed)
            if ($organizationLink->getOrganization() === $this) {
                $organizationLink->setOrganization(null);
            }
        }

        return $this;
    }

    public function getLastUpdateDate(): ?\DateTimeInterface
    {
        return $this->lastUpdateDate;
    }

    public function setLastUpdateDate(?\DateTimeInterface $lastUpdateDate): self
    {
        $this->lastUpdateDate = $lastUpdateDate;

        return $this;
    }

    public function getOrganizationVisual(): ?File
    {
        return $this->organizationVisual;
    }

    public function setOrganizationVisual(?File $organizationVisual): self
    {
        $this->organizationVisual = $organizationVisual;

        return $this;
    }
}
