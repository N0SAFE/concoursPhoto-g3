<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Controller\CompetitionController;
use App\Repository\CompetitionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource (normalizationContext: ['groups' => ['competition', 'file']])]
// custom operation
#[ApiResource(
    operations: [
        new Get(
            name: CompetitionController::LAST_PICTURES_POSTED,
            uriTemplate: '/competitions/{id}/last-pictures-posted',
            controller: CompetitionController::class
        ),
        new Get(
            name: CompetitionController::LAST_PICTURES_OBTAINED_VOTES,
            uriTemplate: '/competitions/{id}/last-pictures-obtained-votes',
            controller: CompetitionController::class
        ),
        new Get(
            name: CompetitionController::PICTURES_OBTAINED_PRICE,
            uriTemplate: '/competitions/{id}/pictures-obtained-price',
            controller: CompetitionController::class
        )
    ],

)]
#[ORM\Entity(repositoryClass: CompetitionRepository::class)]
class Competition
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['competition', 'user:read', 'user:current:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['competition', 'user:current:read'])]
    private ?bool $state = null;

    #[ORM\Column(length: 255)]
    #[Groups(['competition', 'organization', 'user:current:read'])]
    private ?string $competition_name = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['competition', 'user:current:read'])]
    private ?string $description = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['competition', 'user:current:read'])]
    private ?string $rules = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['competition', 'user:current:read'])]
    private ?string $endowments = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition', 'user:current:read'])]
    private ?\DateTimeInterface $creation_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition', 'user:current:read'])]
    private ?\DateTimeInterface $publication_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition', 'user:current:read'])]
    private ?\DateTimeInterface $submission_start_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition', 'user:current:read'])]
    private ?\DateTimeInterface $submission_end_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition', 'user:current:read'])]
    private ?\DateTimeInterface $voting_start_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition', 'user:current:read'])]
    private ?\DateTimeInterface $voting_end_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['competition', 'user:current:read'])]
    private ?\DateTimeInterface $results_date = null;

    #[ORM\Column]
    #[Groups(['competition', 'user:current:read'])]
    private ?float $weighting_of_jury_votes = null;

    #[ORM\Column]
    #[Groups(['competition', 'user:current:read'])]
    private ?int $number_of_max_votes = null;

    #[ORM\Column]
    #[Groups(['competition', 'user:current:read'])]
    private ?int $number_of_prices = null;

    #[ORM\Column]
    #[Groups(['competition', 'user:current:read'])]
    private ?int $min_age_criteria = null;

    #[ORM\Column]
    #[Groups(['competition', 'user:current:read'])]
    private ?int $max_age_criteria = null;

    #[ORM\ManyToMany(targetEntity: Theme::class, inversedBy: 'competitions')]
    #[Groups(['competition', 'user:current:read'])]
    private Collection $theme;

    #[ORM\ManyToMany(targetEntity: ParticipantCategory::class, inversedBy: 'competitions')]
    #[Groups(['competition', 'user:current:read'])]
    private Collection $participant_category;

    #[Groups(['competition', 'user:current:read'])]
    #[ORM\ManyToOne(inversedBy: 'competitions')]
    private ?Organization $organization = null;

    #[Groups(['competition', 'user:current:read'])]
    #[ORM\OneToMany(mappedBy: 'competition', targetEntity: Sponsors::class)]
    private Collection $sponsors;

    #[ORM\OneToMany(mappedBy: 'competition', targetEntity: MemberOfTheJury::class)]
    #[Groups(['competition', 'user:current:read'])]
    private Collection $memberOfTheJuries;

    #[Groups(['competition', 'user:current:read'])]
    #[ORM\OneToMany(mappedBy: 'competition', targetEntity: Picture::class)]
    private Collection $pictures;

    #[ORM\Column(type: 'json')]
    #[Groups(['competition', 'user:current:read'])]
    private array $country_criteria = [];

    #[ORM\Column(type: 'json')]
    #[Groups(['competition', 'user:current:read'])]
    private array $region_criteria = [];

    #[ORM\Column(type: 'json')]
    #[Groups(['competition', 'user:current:read'])]

    private array $department_criteria = [];

    #[ORM\Column(type: 'json')]
    #[Groups(['competition', 'user:current:read'])]
    private array $city_criteria = [];

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['competition', 'user:current:read'])]
    private ?File $competition_visual = null;

    public function __construct()
    {
        $this->theme = new ArrayCollection();
        $this->participant_category = new ArrayCollection();
        $this->sponsors = new ArrayCollection();
        $this->memberOfTheJuries = new ArrayCollection();
        $this->pictures = new ArrayCollection();
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

    public function getCompetitionName(): ?string
    {
        return $this->competition_name;
    }

    public function setCompetitionName(string $competition_name): self
    {
        $this->competition_name = $competition_name;

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
        return $this->creation_date;
    }

    public function setCreationDate(\DateTimeInterface $creation_date): self
    {
        $this->creation_date = $creation_date;

        return $this;
    }

    public function getPublicationDate(): ?\DateTimeInterface
    {
        return $this->publication_date;
    }

    public function setPublicationDate(\DateTimeInterface $publication_date): self
    {
        $this->publication_date = $publication_date;

        return $this;
    }

    public function getSubmissionStartDate(): ?\DateTimeInterface
    {
        return $this->submission_start_date;
    }

    public function setSubmissionStartDate(\DateTimeInterface $submission_start_date): self
    {
        $this->submission_start_date = $submission_start_date;

        return $this;
    }

    public function getSubmissionEndDate(): ?\DateTimeInterface
    {
        return $this->submission_end_date;
    }

    public function setSubmissionEndDate(\DateTimeInterface $submission_end_date): self
    {
        $this->submission_end_date = $submission_end_date;

        return $this;
    }

    public function getVotingStartDate(): ?\DateTimeInterface
    {
        return $this->voting_start_date;
    }

    public function setVotingStartDate(\DateTimeInterface $voting_start_date): self
    {
        $this->voting_start_date = $voting_start_date;

        return $this;
    }

    public function getVotingEndDate(): ?\DateTimeInterface
    {
        return $this->voting_end_date;
    }

    public function setVotingEndDate(\DateTimeInterface $voting_end_date): self
    {
        $this->voting_end_date = $voting_end_date;

        return $this;
    }

    public function getResultsDate(): ?\DateTimeInterface
    {
        return $this->results_date;
    }

    public function setResultsDate(\DateTimeInterface $results_date): self
    {
        $this->results_date = $results_date;

        return $this;
    }

    public function getWeightingOfJuryVotes(): ?float
    {
        return $this->weighting_of_jury_votes;
    }

    public function setWeightingOfJuryVotes(float $weighting_of_jury_votes): self
    {
        $this->weighting_of_jury_votes = $weighting_of_jury_votes;

        return $this;
    }

    public function getNumberOfMaxVotes(): ?int
    {
        return $this->number_of_max_votes;
    }

    public function setNumberOfMaxVotes(int $number_of_max_votes): self
    {
        $this->number_of_max_votes = $number_of_max_votes;

        return $this;
    }

    public function getNumberOfPrices(): ?int
    {
        return $this->number_of_prices;
    }

    public function setNumberOfPrices(int $number_of_prices): self
    {
        $this->number_of_prices = $number_of_prices;

        return $this;
    }

    public function getMinAgeCriteria(): ?int
    {
        return $this->min_age_criteria;
    }

    public function setMinAgeCriteria(int $min_age_criteria): self
    {
        $this->min_age_criteria = $min_age_criteria;

        return $this;
    }

    public function getMaxAgeCriteria(): ?int
    {
        return $this->max_age_criteria;
    }

    public function setMaxAgeCriteria(int $max_age_criteria): self
    {
        $this->max_age_criteria = $max_age_criteria;

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
        return $this->participant_category;
    }

    public function addParticipantCategory(ParticipantCategory $participantCategory): self
    {
        if (!$this->participant_category->contains($participantCategory)) {
            $this->participant_category->add($participantCategory);
        }

        return $this;
    }

    public function removeParticipantCategory(ParticipantCategory $participantCategory): self
    {
        $this->participant_category->removeElement($participantCategory);

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
            $sponsor->setCompetition($this);
        }

        return $this;
    }

    public function removeSponsor(Sponsors $sponsor): self
    {
        if ($this->sponsors->removeElement($sponsor)) {
            // set the owning side to null (unless already changed)
            if ($sponsor->getCompetition() === $this) {
                $sponsor->setCompetition(null);
            }
        }

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

    public function removeMemberOfTheJury(MemberOfTheJury $memberOfTheJury): self
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

    public function addPicture(Picture $picture): self
    {
        if (!$this->pictures->contains($picture)) {
            $this->pictures->add($picture);
            $picture->setCompetition($this);
        }

        return $this;
    }

    public function removePicture(Picture $picture): self
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
        return $this->country_criteria;
    }

    public function setCountryCriteria(array $country_criteria): self
    {
        $this->country_criteria = $country_criteria;

        return $this;
    }

    public function getRegionCriteria(): array
    {
        return $this->region_criteria;
    }

    public function setRegionCriteria(array $region_criteria): self
    {
        $this->region_criteria = $region_criteria;

        return $this;
    }

    public function getDepartmentCriteria(): array
    {
        return $this->department_criteria;
    }

    public function setDepartmentCriteria(array $department_criteria): self
    {
        $this->department_criteria = $department_criteria;

        return $this;
    }

    public function getCityCriteria(): array
    {
        return $this->city_criteria;
    }

    public function setCityCriteria(array $city_criteria): self
    {
        $this->city_criteria = $city_criteria;

        return $this;
    }

    public function getCompetitionVisual(): ?File
    {
        return $this->competition_visual;
    }

    public function setCompetitionVisual(?File $competition_visual): self
    {
        $this->competition_visual = $competition_visual;

        return $this;
    }
}
