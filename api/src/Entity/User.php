<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Serializer\Filter\GroupFilter;
use ApiPlatform\Serializer\Filter\PropertyFilter;
use App\Controller\UserController;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\State\UserStateProcessor;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[
    ApiResource(
        operations: [
            new GetCollection(),
            new Post(processor: UserStateProcessor::class),
            new Get(),
            new Get(
                name: UserController::USER_COMPETITIONS,
                uriTemplate: '/users/{id}/user-competitions',
                controller: UserController::class
            ),
            new Patch(processor: UserStateProcessor::class),
            new Delete(),
        ],
        normalizationContext: ['groups' => ['user:read']],
        denormalizationContext: ['groups' => ['user:write', 'userLink:write']]
    )
]
#[ApiFilter(PropertyFilter::class)]
#[
    ApiFilter(
        SearchFilter::class,
        properties: ['roles' => 'partial', 'Manage' => 'exact']
    )
]
#[ApiFilter(GroupFilter::class)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements PasswordAuthenticatedUserInterface, UserInterface
{
    #[Groups(['user:read', 'user:current:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column]
    private ?bool $state = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $creationDate = null;

    #[Groups(['user:gender:read', 'user:current:read', 'user:write'])]
    #[ORM\ManyToOne(inversedBy: 'users')]
    private ?Gender $gender = null;

    #[
        Groups([
            'user:read',
            'user:current:read',
            'user:write',
        ])
    ]
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $firstname = null;

    #[
        Groups([
            'user:read',
            'user:current:read',
            'user:write',
        ])
    ]
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $lastname = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotBlank]
    private ?\DateTimeInterface $dateOfBirth = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $address = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $postcode = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $citycode = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $country = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(type: 'string', length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    private $email;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(length: 255, nullable: true)]
    #[
        Assert\Length(
            10,
            minMessage: 'Le numéro de téléphone doit avoir au moins 10 caractères'
        )
    ]
    #[
        Assert\Regex(
            pattern: '/^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/',
            message: 'Le numéro de téléphone doit être au format 06 00 00 00 00 ou +33 6 00 00 00 00'
        )
    ]
    private ?string $phoneNumber = null;

    #[ORM\Column(type: 'string')]
    private $password;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[
        Assert\Length(
            min: 8,
            minMessage: 'Le mot de passe doit avoir au moins 8 caractères'
        )
    ]
    #[
        Assert\Regex(
            pattern: '/^(?=.*[A-Z])(?=.*\d).+$/',
            message: 'Le mot de passe doit contenir au moins une lettre majuscule et un chiffre'
        )
    ]
    private ?string $plainPassword = null;

    #[ORM\ManyToMany(targetEntity: Organization::class, inversedBy: 'admins')]
    #[Groups(['user:manage:read', 'user:current:read', 'user:write'])]
    private Collection $Manage;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[
        Groups([
            'user:photographerCategory:read',
            'user:current:read',
            'user:write',
        ])
    ]
    private ?PhotographerCategory $photographerCategory = null;

    #[
        Groups([
            'user:memberOfTheJuries:read',
            'user:current:read',
            'user:write',
        ])
    ]
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: MemberOfTheJury::class)]
    private Collection $memberOfTheJuries;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Picture::class)]
    #[Groups(['user:pictures:read', 'user:current:read', 'user:write'])]
    private Collection $pictures;

    #[Groups(['user:votes:read', 'user:current:read', 'user:write'])]
    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Vote::class)]
    private Collection $votes;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $registrationDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $deleteDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updateDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $lastConnectionDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    private ?string $photographerDescription = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    private ?string $websiteUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    private ?string $pseudonym = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(type: 'json')]
    private $roles = [];

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column]
    private ?bool $isVerified = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\ManyToOne(inversedBy: 'users')]
    #[Assert\NotBlank]
    private ?PersonalStatut $personalStatut = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?File $pictureProfil = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $region = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $department = null;

    #[Groups(['user:read', 'user:current:read', 'user:write'])]
    #[
        ORM\OneToMany(
            mappedBy: 'user',
            targetEntity: UserLink::class,
            cascade: ['persist', 'remove']
        )
    ]
    private Collection $userLinks;

    #[
        ORM\ManyToMany(
            targetEntity: NotificationType::class,
            inversedBy: 'subscribedUsers'
        )
    ]
    #[
        Groups([
            'user:notificationEnabled:read',
            'user:current:read',
            'user:write',
        ])
    ]
    private Collection $notificationEnabled;

    public function __construct()
    {
        $this->Manage = new ArrayCollection();
        $this->memberOfTheJuries = new ArrayCollection();
        $this->pictures = new ArrayCollection();
        $this->votes = new ArrayCollection();
        $this->roles = new ArrayCollection();
        $this->userLinks = new ArrayCollection();
        $this->notificationEnabled = new ArrayCollection();
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
        return $this->creationDate;
    }

    public function setCreationDate(\DateTimeInterface $creationDate): self
    {
        $this->creationDate = $creationDate;

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
        return $this->dateOfBirth;
    }

    public function setDateOfBirth(\DateTimeInterface $dateOfBirth): self
    {
        $this->dateOfBirth = $dateOfBirth;

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
        return $this->phoneNumber;
    }

    public function setPhoneNumber(string $phoneNumber): self
    {
        $this->phoneNumber = $phoneNumber;

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
     * A visual identifier that represents this user:read.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        $this->plainPassword = null;
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
        return $this->photographerCategory;
    }

    public function setPhotographerCategory(
        ?PhotographerCategory $photographerCategory
    ): self {
        $this->photographerCategory = $photographerCategory;

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

    public function removeMemberOfTheJury(
        MemberOfTheJury $memberOfTheJury
    ): self {
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
        return $this->registrationDate;
    }

    public function setRegistrationDate(
        \DateTimeInterface $registrationDate
    ): self {
        $this->registrationDate = $registrationDate;

        return $this;
    }

    public function getDeleteDate(): ?\DateTimeInterface
    {
        return $this->deleteDate;
    }

    public function setDeleteDate(\DateTimeInterface $deleteDate): self
    {
        $this->deleteDate = $deleteDate;

        return $this;
    }

    public function getUpdateDate(): ?\DateTimeInterface
    {
        return $this->updateDate;
    }

    public function setUpdateDate(\DateTimeInterface $updateDate): self
    {
        $this->updateDate = $updateDate;

        return $this;
    }

    public function getLastConnectionDate(): ?\DateTimeInterface
    {
        return $this->lastConnectionDate;
    }

    public function setLastConnectionDate(
        \DateTimeInterface $lastConnectionDate
    ): self {
        $this->lastConnectionDate = $lastConnectionDate;

        return $this;
    }

    public function getPhotographerDescription(): ?string
    {
        return $this->photographerDescription;
    }

    public function setPhotographerDescription(
        string $photographerDescription
    ): self {
        $this->photographerDescription = $photographerDescription;

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
        // guarantee every user:read at least has ROLE_USER
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
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): self
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getPersonalStatut(): ?PersonalStatut
    {
        return $this->personalStatut;
    }

    public function setPersonalStatut(?PersonalStatut $personalStatut): self
    {
        $this->personalStatut = $personalStatut;

        return $this;
    }

    public function getPictureProfil(): ?File
    {
        return $this->pictureProfil;
    }

    public function setPictureProfil(?File $pictureProfil): self
    {
        $this->pictureProfil = $pictureProfil;

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

    /**
     * @return Collection<int, UserLink>
     */
    public function getUserLinks(): Collection
    {
        return $this->userLinks;
    }

    public function addUserLink(UserLink $userLink): self
    {
        if (!$this->userLinks->contains($userLink)) {
            $this->userLinks->add($userLink);
            $userLink->setUser($this);
        }

        return $this;
    }

    public function removeUserLink(UserLink $userLink): self
    {
        if ($this->userLinks->removeElement($userLink)) {
            // set the owning side to null (unless already changed)
            if ($userLink->getUser() === $this) {
                $userLink->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, NotificationType>
     */
    public function getNotificationEnabled(): Collection
    {
        return $this->notificationEnabled;
    }

    public function addNotificationEnabled(
        NotificationType $notificationEnabled
    ): self {
        if (!$this->notificationEnabled->contains($notificationEnabled)) {
            $this->notificationEnabled->add($notificationEnabled);
        }

        return $this;
    }

    public function removeNotificationEnabled(
        NotificationType $notificationEnabled
    ): self {
        $this->notificationEnabled->removeElement($notificationEnabled);

        return $this;
    }
}
