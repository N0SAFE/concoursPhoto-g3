<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Metaclass\FilterBundle\Filter\FilterLogic;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Serializer\Filter\PropertyFilter;
use ApiPlatform\Serializer\Filter\GroupFilter;
use App\Repository\CompetitionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiFilter(DateFilter::class, properties: ['resultsDate', 'creationDate'])]
#[ApiFilter(PropertyFilter::class)]
#[
    ApiFilter(
        SearchFilter::class,
        properties: [
            'organization.admins' => 'exact',
            'pictures.user' => 'exact',
            'organization' => 'exact',
            'theme' => 'exact',
            'participantCategory' => 'exact',
            'competitionName' => 'partial',
            'theme.label' => 'partial',
            'participantCategory.label' => 'partial',
            'regionCriteria' => 'partial',
            'departmentCriteria' => 'partial',
        ]
    )
]
#[ApiFilter(GroupFilter::class)]
#[ApiFilter(RangeFilter::class)]
#[ApiFilter(FilterLogic::class)]
#[
    ApiResource(
        operations: [
            new GetCollection(),
            new Get(),
            new Get(
                name: 'CompetitionView',
                uriTemplate: '/competitions/view/{id}'
            ),
            new Post(name: 'CompetitionCreate'),
            new Patch(),
            new Delete(),
        ],
        normalizationContext: [
            'groups' => ['competition:read'],
        ]
    )
]
#[ORM\Entity(repositoryClass: CompetitionRepository::class)]
class Competition
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?string $competitionName = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?string $rules = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?string $endowments = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?\DateTimeInterface $creationDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?\DateTimeInterface $publicationDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?\DateTimeInterface $submissionStartDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?\DateTimeInterface $submissionEndDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?\DateTimeInterface $votingStartDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?\DateTimeInterface $votingEndDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?\DateTimeInterface $resultsDate = null;

    #[ORM\Column]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?float $weightingOfJuryVotes = null;

    #[ORM\Column]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?int $numberOfMaxVotes = null;

    #[ORM\Column]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?int $numberOfMaxPictures = null;

    #[ORM\Column]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?int $numberOfPrices = null;

    #[ORM\Column]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?int $minAgeCriteria = null;

    #[ORM\Column]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?int $maxAgeCriteria = null;

    #[ORM\ManyToMany(targetEntity: Theme::class, inversedBy: 'competitions')]
    #[Groups(['competition:theme:read', 'user:current:read'])]
    private Collection $theme;

    #[
        ORM\ManyToMany(
            targetEntity: ParticipantCategory::class,
            inversedBy: 'competitions'
        )
    ]
    #[Groups(['competition:participantCategory:read', 'user:current:read'])]
    private Collection $participantCategory;

    #[Groups(['competition:organization:read'])]
    #[ORM\ManyToOne(inversedBy: 'competitions')]
    private ?Organization $organization = null;

    #[
        ORM\OneToMany(
            mappedBy: 'competition',
            targetEntity: MemberOfTheJury::class
        )
    ]
    #[Groups(['competition:memberOfTheJuries:read', 'user:current:read'])]
    private Collection $memberOfTheJuries;

    #[Groups(['competition:pictures:read'])]
    #[ORM\OneToMany(mappedBy: 'competition', targetEntity: Picture::class)]
    private Collection $pictures;

    #[ORM\Column(type: 'json')]
    #[Groups(['competition:read', 'user:current:read'])]
    private array $countryCriteria = [];

    #[ORM\Column(type: 'json')]
    #[Groups(['competition:read', 'user:current:read'])]
    private array $regionCriteria = [];

    #[ORM\Column(type: 'json')]
    #[Groups(['competition:read', 'user:current:read'])]
    private array $departmentCriteria = [];

    #[ORM\Column(type: 'json')]
    #[Groups(['competition:read', 'user:current:read'])]
    private array $cityCriteria = [];

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['competition:competitionVisual:read', 'user:current:read'])]
    private ?File $competitionVisual = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['competition:read', 'user:current:read'])]
    private ?bool $isPromoted = null;

    #[Groups(['competition:notificationsSended:read'])]
    #[
        ORM\ManyToMany(
            targetEntity: NotificationType::class,
            inversedBy: 'competitionAlreadyHandled'
        )
    ]
    private Collection $notificationsSended;

    #[Groups(['competition:read'])]
    #[ORM\Column(nullable: true)]
    private ?int $consultationCount = null;

    #[Groups(['competition:read', 'user:current:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $competitionResults = null;

    #[Groups(['competition:read', 'user:current:read'])]
    private ?bool $userCanEdit = false;

    #[Groups(['competition:read'])]
    #[ORM\Column(nullable: true)]
    private ?bool $isPublished = null;

    #[Groups(['competition:read'])]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $activationDate = null;

    #[ORM\OneToMany(mappedBy: 'competition', targetEntity: Sponsors::class)]
    #[Groups(['competition:sponsor:read', 'user:current:read', 'competition:read'])]
    private Collection $sponsors;

    public function __construct()
    {
        $this->theme = new ArrayCollection();
        $this->participantCategory = new ArrayCollection();
        $this->memberOfTheJuries = new ArrayCollection();
        $this->pictures = new ArrayCollection();
        $this->notificationsSended = new ArrayCollection();
        $this->sponsors = new ArrayCollection();
    }

    public function getUserCanEdit(): bool
    {
        return $this->userCanEdit;
    }

    public function setUserCanEdit(bool $userCanEdit): Competition
    {
        $this->userCanEdit = $userCanEdit;

        return $this;
    }

    #[Groups(['competition:read'])]
    public function getAside(): Collection
    {
        if ($this->getState() === 2 || $this->getState() === 3) {
            $lastPicturesPosted = $this->getPictures()->toArray();
            usort($lastPicturesPosted, function ($a, $b) {
                return $a->getId() <=> $b->getId();
            });
            $lastPicturesPosted = array_slice($lastPicturesPosted, 0, 8);
            return new ArrayCollection($lastPicturesPosted);
        } elseif ($this->getState() === 4 || $this->getState() === 5) {
            $lastPicturesObtainedVotes = $this->getPictures()
                ->filter(function (Picture $picture) {
                    return $picture->getVotes()->count() > 0;
                })
                ->toArray();
            usort($lastPicturesObtainedVotes, function (
                Picture $a,
                Picture $b
            ) {
                // sort by lastVote
                $lastVoteA = $a->getVotes()->toArray();
                usort($lastVoteA, function (Vote $a, Vote $b) {
                    return $a->getVoteDate() <=> $b->getVoteDate();
                });
                $lastVoteA = $lastVoteA[count($lastVoteA) - 1];

                $lastVoteB = $b->getVotes()->toArray();
                usort($lastVoteB, function (Vote $a, Vote $b) {
                    return $a->getVoteDate() <=> $b->getVoteDate();
                });
                $lastVoteB = $lastVoteB[count($lastVoteB) - 1];

                return $lastVoteA->getVoteDate() <=> $lastVoteB->getVoteDate();
            });
            $lastPicturesObtainedVotes = array_slice(
                $lastPicturesObtainedVotes,
                0,
                8
            );
            return new ArrayCollection($lastPicturesObtainedVotes);
        } elseif ($this->getState() === 6) {
            $picturesObtainedPrice = $this->getPictures()
                ->filter(function (Picture $picture) {
                    return $picture->isPriceWon() !== null;
                })
                ->toArray();
            usort($picturesObtainedPrice, function ($a, $b) {
                // sort by id
                return $a->getId() <=> $b->getId();
            });
            $picturesObtainedPrice = array_slice($picturesObtainedPrice, 0, 8);
            return new ArrayCollection($picturesObtainedPrice);
        }

        return new ArrayCollection();
    }

    #[Groups(['competition:read'])]
    public function getAsideLabel(): string
    {
        if ($this->getState() === 2 || $this->getState() === 3) {
            return 'Dernières photos soumises';
        } elseif ($this->getState() === 4 || $this->getState() === 5) {
            return 'Dernières photos ayant obtenu un vote';
        } elseif ($this->getState() === 6) {
            return 'Photos ayant obtenu un prix';
        } else {
            return 'Photo à venir';
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    #[Groups(['competition:read'])]
    public function getOrganizers(): Collection
    {
        $users = new ArrayCollection();
        foreach ($this->getPictures() as $picture) {
            if ($picture->getUser()->getRoles()[0] === 'ROLE_ORGANIZER' && !$users->contains($picture->getUser())) {
                $users->add($picture->getUser());
            }
        }

        return $users;
    }

    #[Groups(['competition:read'])]
    public function getNumberOfPictures(): int
    {
        return $this->pictures->count();
    }

    #[Groups(['competition:read'])]
    public function getNumberOfParticipants(): int
    {
        $pictures = $this->getPictures();
        $userDistinct = [];
        foreach ($pictures as $picture) {
            $userDistinct[$picture->getUser()->getId()] = $picture->getUser();
        }
        return count($userDistinct);
    }
    #[Groups(['competition:photographer:read'])]
    public function getPhotographers(): Collection
    {
        $pictures = $this->getPictures();
        $userDistinct = [];
        foreach ($pictures as $picture) {
            $userDistinct[] = $picture->getUser();
        }
        return new ArrayCollection($userDistinct);
    }
    #[Groups(['competition:photovote:read'])]
    public function getPicturesMostVoted(): Collection
    {
        $pictures = $this->getPictures();
        $pictures = $pictures->toArray();
        usort($pictures, function ($a, $b) {
            return $b->getVotes()->count() <=> $a->getVotes()->count();
        });
        $pictures = array_slice($pictures, 0, 5);
        return new ArrayCollection($pictures);
    }
    #[Groups(['competition:read'])]
    public function getNumberOfVotes(): int
    {
        $pictures = $this->getPictures();
        $numOfVotes = 0;
        foreach ($pictures as $picture) {
            $numOfVotes += $picture->getVotes()->count();
        }
        return $numOfVotes;
    }

    #[Groups(['competition:read'])]
    public function getState(): int
    {
        $now = new \DateTime();
        if ($now < $this->getSubmissionStartDate()) {
            // return 'A venir';
            return 1;
        } elseif (
            $now > $this->getSubmissionStartDate() &&
            $now < $this->getSubmissionEndDate()
        ) {
            // return 'En phase de participation';
            return 2;
        } elseif (
            $now > $this->getSubmissionEndDate() &&
            $now < $this->getVotingStartDate()
        ) {
            // return 'En attente';
            return 3;
        } elseif (
            $now > $this->getVotingStartDate() &&
            $now < $this->getVotingEndDate()
        ) {
            // return 'En phase de vote';
            return 4;
        } elseif (
            $now > $this->getVotingEndDate() &&
            $now < $this->getResultsDate()
        ) {
            // return "En phase d'attribution";
            return 5;
        } elseif ($now > $this->getResultsDate()) {
            // return 'Terminé';
            return 6;
        }
    }

    #[Groups(['competition:read'])]
    public function getStateLabel(): string
    {
        $now = new \DateTime();
        if ($now < $this->getSubmissionStartDate()) {
            return 'À venir';
            // return 1;
        } elseif (
            $now > $this->getSubmissionStartDate() &&
            $now < $this->getSubmissionEndDate()
        ) {
            return 'En phase de participation';
            // return 2;
        } elseif (
            $now > $this->getSubmissionEndDate() &&
            $now < $this->getVotingStartDate()
        ) {
            return 'En attente';
            // return 3;
        } elseif (
            $now > $this->getVotingStartDate() &&
            $now < $this->getVotingEndDate()
        ) {
            return 'En phase de vote';
            // return 4;
        } elseif (
            $now > $this->getVotingEndDate() &&
            $now < $this->getResultsDate()
        ) {
            return "En phase d'attribution";
            // return 5;
        } elseif ($now > $this->getResultsDate()) {
            return 'Terminé';
            // return 6;
        }
    }
    public function getCompetitionName(): ?string
    {
        return $this->competitionName;
    }

    public function setCompetitionName(string $competitionName): self
    {
        $this->competitionName = $competitionName;

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

    public function getRules(): ?string
    {
        return $this->rules;
    }

    public function setRules(string $rules): self
    {
        $this->rules = $rules;

        return $this;
    }

    public function getEndowments(): ?string
    {
        return $this->endowments;
    }

    public function setEndowments(string $endowments): self
    {
        $this->endowments = $endowments;

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

    public function getPublicationDate(): ?\DateTimeInterface
    {
        return $this->publicationDate;
    }

    public function setPublicationDate(
        \DateTimeInterface $publicationDate
    ): self
    {
        $this->publicationDate = $publicationDate;

        return $this;
    }

    public function getSubmissionStartDate(): ?\DateTimeInterface
    {
        return $this->submissionStartDate;
    }

    public function setSubmissionStartDate(
        \DateTimeInterface $submissionStartDate
    ): self
    {
        $this->submissionStartDate = $submissionStartDate;

        return $this;
    }

    public function getSubmissionEndDate(): ?\DateTimeInterface
    {
        return $this->submissionEndDate;
    }

    public function setSubmissionEndDate(
        \DateTimeInterface $submissionEndDate
    ): self
    {
        $this->submissionEndDate = $submissionEndDate;

        return $this;
    }

    public function getVotingStartDate(): ?\DateTimeInterface
    {
        return $this->votingStartDate;
    }

    public function setVotingStartDate(
        \DateTimeInterface $votingStartDate
    ): self
    {
        $this->votingStartDate = $votingStartDate;

        return $this;
    }

    public function getVotingEndDate(): ?\DateTimeInterface
    {
        return $this->votingEndDate;
    }

    public function setVotingEndDate(\DateTimeInterface $votingEndDate): self
    {
        $this->votingEndDate = $votingEndDate;

        return $this;
    }

    public function getResultsDate(): ?\DateTimeInterface
    {
        return $this->resultsDate;
    }

    public function setResultsDate(\DateTimeInterface $resultsDate): self
    {
        $this->resultsDate = $resultsDate;

        return $this;
    }

    public function getWeightingOfJuryVotes(): ?float
    {
        return $this->weightingOfJuryVotes;
    }

    public function setWeightingOfJuryVotes(float $weightingOfJuryVotes): self
    {
        $this->weightingOfJuryVotes = $weightingOfJuryVotes;

        return $this;
    }

    public function getNumberOfMaxVotes(): ?int
    {
        return $this->numberOfMaxVotes;
    }

    public function setNumberOfMaxVotes(int $numberOfMaxVotes): self
    {
        $this->numberOfMaxVotes = $numberOfMaxVotes;

        return $this;
    }

    public function getNumberOfMaxPictures(): ?int
    {
        return $this->numberOfMaxPictures;
    }

    public function setNumberOfMaxPictures(int $numberOfMaxPictures): self
    {
        $this->numberOfMaxPictures = $numberOfMaxPictures;

        return $this;
    }

    public function getNumberOfPrices(): ?int
    {
        return $this->numberOfPrices;
    }

    public function setNumberOfPrices(int $numberOfPrices): self
    {
        $this->numberOfPrices = $numberOfPrices;

        return $this;
    }

    public function getMinAgeCriteria(): ?int
    {
        return $this->minAgeCriteria;
    }

    public function setMinAgeCriteria(int $minAgeCriteria): self
    {
        $this->minAgeCriteria = $minAgeCriteria;

        return $this;
    }

    public function getMaxAgeCriteria(): ?int
    {
        return $this->maxAgeCriteria;
    }

    public function setMaxAgeCriteria(int $maxAgeCriteria): self
    {
        $this->maxAgeCriteria = $maxAgeCriteria;

        return $this;
    }

    /**
     * @return Collection<int, Theme>
     */
    public function getTheme(): Collection
    {
        return $this->theme;
    }

    public function addTheme(Theme $theme): self
    {
        if (!$this->theme->contains($theme)) {
            $this->theme->add($theme);
        }

        return $this;
    }

    public function removeTheme(Theme $theme): self
    {
        $this->theme->removeElement($theme);

        return $this;
    }

    /**
     * @return Collection<int, ParticipantCategory>
     */
    public function getParticipantCategory(): Collection
    {
        return $this->participantCategory;
    }

    public function addParticipantCategory(
        ParticipantCategory $participantCategory
    ): self
    {
        if (!$this->participantCategory->contains($participantCategory)) {
            $this->participantCategory->add($participantCategory);
        }

        return $this;
    }

    public function removeParticipantCategory(
        ParticipantCategory $participantCategory
    ): self
    {
        $this->participantCategory->removeElement($participantCategory);

        return $this;
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
            $memberOfTheJury->setCompetition($this);
        }

        return $this;
    }

    public function removeMemberOfTheJury(
        MemberOfTheJury $memberOfTheJury
    ): self
    {
        if ($this->memberOfTheJuries->removeElement($memberOfTheJury)) {
            // set the owning side to null (unless already changed)
            if ($memberOfTheJury->getCompetition() === $this) {
                $memberOfTheJury->setCompetition(null);
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

    public function addPictures(Picture $picture): self
    {
        if (!$this->pictures->contains($picture)) {
            $this->pictures->add($picture);
            $picture->setCompetition($this);
        }

        return $this;
    }

    public function removePictures(Picture $picture): self
    {
        if ($this->pictures->removeElement($picture)) {
            // set the owning side to null (unless already changed)
            if ($picture->getCompetition() === $this) {
                $picture->setCompetition(null);
            }
        }

        return $this;
    }

    public function getCountryCriteria(): array
    {
        return $this->countryCriteria;
    }

    public function setCountryCriteria(array $countryCriteria): self
    {
        $this->countryCriteria = $countryCriteria;

        return $this;
    }

    public function getRegionCriteria(): array
    {
        return $this->regionCriteria;
    }

    public function setRegionCriteria(array $regionCriteria): self
    {
        $this->regionCriteria = $regionCriteria;

        return $this;
    }

    public function getDepartmentCriteria(): array
    {
        return $this->departmentCriteria;
    }

    public function setDepartmentCriteria(array $departmentCriteria): self
    {
        $this->departmentCriteria = $departmentCriteria;

        return $this;
    }

    public function getCityCriteria(): array
    {
        return $this->cityCriteria;
    }

    public function setCityCriteria(array $cityCriteria): self
    {
        $this->cityCriteria = $cityCriteria;

        return $this;
    }

    public function getCompetitionVisual(): ?File
    {
        return $this->competitionVisual;
    }

    public function setCompetitionVisual(?File $competitionVisual): self
    {
        $this->competitionVisual = $competitionVisual;

        return $this;
    }

    public function isIsPromoted(): ?bool
    {
        return $this->isPromoted;
    }

    public function setIsPromoted(?bool $isPromoted): self
    {
        $this->isPromoted = $isPromoted;

        return $this;
    }

    /**
     * @return Collection<int, NotificationType>
     */
    public function getNotificationsSended(): Collection
    {
        return $this->notificationsSended;
    }

    public function addNotificationsSended(
        NotificationType $notificationsSended
    ): self
    {
        if (!$this->notificationsSended->contains($notificationsSended)) {
            $this->notificationsSended->add($notificationsSended);
        }

        return $this;
    }

    public function removeNotificationsSended(
        NotificationType $notificationsSended
    ): self
    {
        $this->notificationsSended->removeElement($notificationsSended);

        return $this;
    }

    public function getConsultationCount(): ?int
    {
        return $this->consultationCount;
    }

    public function setConsultationCount(?int $consultationCount): self
    {
        $this->consultationCount = $consultationCount;

        return $this;
    }

    public function getCompetitionResults(): ?string
    {
        return $this->competitionResults;
    }

    public function setCompetitionResults(?string $competitionResults): static
    {
        $this->competitionResults = $competitionResults;

        return $this;
    }

    public function isIsPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(?bool $isPublished): static
    {
        $this->isPublished = $isPublished;

        return $this;
    }

    public function getActivationDate(): ?\DateTimeInterface
    {
        return $this->activationDate;
    }

    public function setActivationDate(
        \DateTimeInterface $activationDate
    ): self
    {
        $this->activationDate = $activationDate;

        return $this;
    }

    /**
     * @return Collection<int, Sponsors>
     */
    public function getSponsors(): Collection
    {
        return $this->sponsors;
    }

    public function addSponsor(Sponsors $sponsor): static
    {
        if (!$this->sponsors->contains($sponsor)) {
            $this->sponsors->add($sponsor);
            $sponsor->setCompetition($this);
        }

        return $this;
    }

    public function removeSponsor(Sponsors $sponsor): static
    {
        if ($this->sponsors->removeElement($sponsor)) {
            // set the owning side to null (unless already changed)
            if ($sponsor->getCompetition() === $this) {
                $sponsor->setCompetition(null);
            }
        }

        return $this;
    }
}
