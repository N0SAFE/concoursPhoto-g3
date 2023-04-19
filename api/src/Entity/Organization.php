<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\OrganizationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(normalizationContext: ['groups' => ['organization', 'file']])]
#[ORM\Entity(repositoryClass: OrganizationRepository::class)]
class Organization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['organization', 'competition'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups('organization')]
    private ?bool $state = null;

    #[ORM\Column(length: 255)]
    #[Groups(['organization', 'competition', 'user'])]

    private ?string $organizer_name = null;

    #[ORM\Column(length: 255)]
    #[Groups('organization')]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups('organization')]
    private ?string $address = null;

    #[ORM\Column]
    #[Groups('organization')]
    private ?string $postcode = null;

    #[ORM\Column(length: 255)]
    #[Groups('organization')]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Groups('organization')]
    private ?string $website_url = null;

    #[ORM\Column(length: 255)]
    #[Groups('organization')]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups('organization')]
    private ?string $number_phone = null;

    #[ORM\Column(length: 255)]
    #[Groups('organization')]
    private ?string $country = null;

    #[ORM\ManyToOne(inversedBy: 'organizations')]
    #[Groups('organization')]
    private ?OrganizationType $organization_type = null;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'Manage')]
    private Collection $users;

    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: Rent::class)]
    private Collection $rents;

    #[Groups(['organization'])]
    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: Competition::class)]
    private Collection $competitions;

    #[ORM\OneToMany(mappedBy: 'organization', targetEntity: Sponsors::class)]
    private Collection $sponsors;

    #[Groups(['organization'])]
    #[ORM\Column(length: 255)]
    private ?string $intra_community_vat = null;

    #[Groups(['organization'])]
    #[ORM\Column(length: 255)]
    private ?string $number_siret = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['organization', 'competition'])]
    private ?File $logo = null;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->rents = new ArrayCollection();
        $this->competitions = new ArrayCollection();
        $this->sponsors = new ArrayCollection();
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
        return $this->organizer_name;
    }

    public function setOrganizerName(string $organizer_name): self
    {
        $this->organizer_name = $organizer_name;

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

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getWebsiteUrl(): ?string
    {
        return $this->website_url;
    }

    public function setWebsiteUrl(string $website_url): self
    {
        $this->website_url = $website_url;

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
        return $this->number_phone;
    }

    public function setNumberPhone(string $number_phone): self
    {
        $this->number_phone = $number_phone;

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
        return $this->organization_type;
    }

    public function setOrganizationType(?OrganizationType $organization_type): self
    {
        $this->organization_type = $organization_type;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->addManage($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
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
        return $this->intra_community_vat;
    }

    public function setIntraCommunityVat(string $intra_community_vat): self
    {
        $this->intra_community_vat = $intra_community_vat;

        return $this;
    }

    public function getNumberSiret(): ?string
    {
        return $this->number_siret;
    }

    public function setNumberSiret(string $number_siret): self
    {
        $this->number_siret = $number_siret;

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
}
