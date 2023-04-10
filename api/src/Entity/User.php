<?php

namespace App\Entity;

use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\State\UserPasswordHasher;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;


#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(processor: UserPasswordHasher::class),
        new Get(),
        new Patch(processor: UserPasswordHasher::class),
        new Delete()
    ],
    normalizationContext: ['groups' => ['user']]
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements PasswordAuthenticatedUserInterface, UserInterface
{
    #[Groups(['user', 'competition'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Groups('user')]
    #[ORM\Column]
    private ?bool $state = null;

    #[Groups('user')]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $creation_date = null;

    #[Groups('user')]
    #[ORM\ManyToOne(inversedBy: 'users')]
    private ?Gender $gender = null;

    #[Groups('user')]
    #[ORM\Column(length: 255)]
    private ?string $firstname = null;

    #[Groups('user')]
    #[ORM\Column(length: 255)]
    private ?string $lastname = null;

    #[Groups('user')]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date_of_birth = null;

    #[Groups('user')]
    #[ORM\Column(length: 255)]
    private ?string $address = null;

    #[Groups('user')]
    #[ORM\Column(length: 255)]
    private ?string $postcode = null;

    #[Groups('user')]
    #[ORM\Column(length: 255)]
    private ?string $city = null;

    #[Groups('user')]
    #[ORM\Column(length: 255)]
    private ?string $country = null;

    #[Groups('user')]
    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private $email;

    #[Groups('user')]
    #[ORM\Column(length: 255)]
    private ?string $phone_number = null;

    #[Groups('user')]
    #[ORM\Column(type: 'string')]
    private $password;

    #[Groups('user')]
    private ?string $plainPassword = null;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'users')]
    private Collection $Manage;

    #[ORM\ManyToOne(inversedBy: 'users')]
    private ?PhotographerCategory $photographer_category = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: MemberOfTheJury::class)]
    private Collection $memberOfTheJuries;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Picture::class)]
    private Collection $pictures;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Vote::class)]
    private Collection $votes;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $registration_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $delete_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $update_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $last_connection_date = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $photographer_description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $website_url = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $socials_networks = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $pseudonym = null;

    #[Groups('user')]
    #[ORM\Column(type: 'json')]
    private $roles = [];

    #[Groups('user')]
    #[ORM\Column]
    private ?bool $is_verified = null;

    #[Groups('user')]
    #[ORM\ManyToOne(inversedBy: 'users')]
    
    private ?PersonalStatut $personal_statut = null;
    

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?File $picture_profil = null;

    #[ORM\Column(length: 255)]
    private ?string $region = null;

    #[ORM\Column(length: 255)]
    private ?string $department = null;

    public function __construct()
    {
        $this->Manage = new ArrayCollection();
        $this->memberOfTheJuries = new ArrayCollection();
        $this->pictures = new ArrayCollection();
        $this->votes = new ArrayCollection();
        $this->roles = new ArrayCollection();
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

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creation_date;
    }

    public function setCreationDate(\DateTimeInterface $creation_date): self
    {
        $this->creation_date = $creation_date;

        return $this;
    }

    public function getGender(): ?Gender
    {
        return $this->gender;
    }

    public function setGender(?Gender $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getDateOfBirth(): ?\DateTimeInterface
    {
        return $this->date_of_birth;
    }

    public function setDateOfBirth(\DateTimeInterface $date_of_birth): self
    {
        $this->date_of_birth = $date_of_birth;

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

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): self
    {
        $this->country = $country;

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

    public function getPhoneNumber(): ?string
    {
        return $this->phone_number;
    }

    public function setPhoneNumber(string $phone_number): self
    {
        $this->phone_number = $phone_number;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Organization>
     */
    public function getManage(): Collection
    {
        return $this->Manage;
    }

    public function addManage(Organization $manage): self
    {
        if (!$this->Manage->contains($manage)) {
            $this->Manage->add($manage);
        }

        return $this;
    }

    public function removeManage(Organization $manage): self
    {
        $this->Manage->removeElement($manage);

        return $this;
    }

    public function getPhotographerCategory(): ?PhotographerCategory
    {
        return $this->photographer_category;
    }

    public function setPhotographerCategory(?PhotographerCategory $photographer_category): self
    {
        $this->photographer_category = $photographer_category;

        return $this;
    }

    /**
     * @return Collection<int, MemberOfTheJury>
     */
    public function getMemberOfTheJuries(): Collection
    {
        return $this->memberOfTheJuries;
    }

    public function addMemberOfTheJury(MemberOfTheJury $memberOfTheJury): self
    {
        if (!$this->memberOfTheJuries->contains($memberOfTheJury)) {
            $this->memberOfTheJuries->add($memberOfTheJury);
            $memberOfTheJury->setUser($this);
        }

        return $this;
    }

    public function removeMemberOfTheJury(MemberOfTheJury $memberOfTheJury): self
    {
        if ($this->memberOfTheJuries->removeElement($memberOfTheJury)) {
            // set the owning side to null (unless already changed)
            if ($memberOfTheJury->getUser() === $this) {
                $memberOfTheJury->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Picture>
     */
    public function getPictures(): Collection
    {
        return $this->pictures;
    }

    public function addPicture(Picture $picture): self
    {
        if (!$this->pictures->contains($picture)) {
            $this->pictures->add($picture);
            $picture->setUser($this);
        }

        return $this;
    }

    public function removePicture(Picture $picture): self
    {
        if ($this->pictures->removeElement($picture)) {
            // set the owning side to null (unless already changed)
            if ($picture->getUser() === $this) {
                $picture->setUser(null);
            }
        }

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
            $vote->setUser($this);
        }

        return $this;
    }

    public function removeVote(Vote $vote): self
    {
        if ($this->votes->removeElement($vote)) {
            // set the owning side to null (unless already changed)
            if ($vote->getUser() === $this) {
                $vote->setUser(null);
            }
        }

        return $this;
    }

    public function getRegistrationDate(): ?\DateTimeInterface
    {
        return $this->registration_date;
    }

    public function setRegistrationDate(\DateTimeInterface $registration_date): self
    {
        $this->registration_date = $registration_date;

        return $this;
    }

    public function getDeleteDate(): ?\DateTimeInterface
    {
        return $this->delete_date;
    }

    public function setDeleteDate(\DateTimeInterface $delete_date): self
    {
        $this->delete_date = $delete_date;

        return $this;
    }

    public function getUpdateDate(): ?\DateTimeInterface
    {
        return $this->update_date;
    }

    public function setUpdateDate(\DateTimeInterface $update_date): self
    {
        $this->update_date = $update_date;

        return $this;
    }

    public function getLastConnectionDate(): ?\DateTimeInterface
    {
        return $this->last_connection_date;
    }

    public function setLastConnectionDate(\DateTimeInterface $last_connection_date): self
    {
        $this->last_connection_date = $last_connection_date;

        return $this;
    }

    public function getPhotographerDescription(): ?string
    {
        return $this->photographer_description;
    }

    public function setPhotographerDescription(string $photographer_description): self
    {
        $this->photographer_description = $photographer_description;

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

    public function getSocialsNetworks(): ?string
    {
        return $this->socials_networks;
    }

    public function setSocialsNetworks(?string $socials_networks): self
    {
        $this->socials_networks = $socials_networks;

        return $this;
    }

    public function getPseudonym(): ?string
    {
        return $this->pseudonym;
    }

    public function setPseudonym(?string $pseudonym): self
    {
        $this->pseudonym = $pseudonym;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function isIsVerified(): ?bool
    {
        return $this->is_verified;
    }

    public function setIsVerified(bool $is_verified): self
    {
        $this->is_verified = $is_verified;

        return $this;
    }

    public function getPersonalStatut(): ?PersonalStatut
    {
        return $this->personal_statut;
    }

    public function setPersonalStatut(?PersonalStatut $personal_statut): self
    {
        $this->personal_statut = $personal_statut;

        return $this;
    }

    public function getPictureProfil(): ?File
    {
        return $this->picture_profil;
    }

    public function setPictureProfil(?File $picture_profil): self
    {
        $this->picture_profil = $picture_profil;

        return $this;
    }

    public function getRegion(): ?string
    {
        return $this->region;
    }

    public function setRegion(string $region): self
    {
        $this->region = $region;

        return $this;
    }

    public function getDepartment(): ?string
    {
        return $this->department;
    }

    public function setDepartment(string $department): self
    {
        $this->department = $department;

        return $this;
    }

}
