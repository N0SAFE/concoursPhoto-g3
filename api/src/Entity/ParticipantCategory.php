<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ParticipantCategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch()
    ],
    normalizationContext: ['groups' => ['participant_category:read']],
)]
#[ORM\Entity(repositoryClass: ParticipantCategoryRepository::class)]
class ParticipantCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['competition', 'participant_category:read'])]
    private ?int $id = null;

    #[Groups(['competition', 'participant_category:read'])]
    #[ORM\Column(length: 255)]
    private ?string $label = null;

    #[Groups(['competition', 'participant_category:competition:read'])]
    #[ORM\ManyToMany(targetEntity: Competition::class, mappedBy: 'participant_category')]
    private Collection $competitions;

    public function __construct()
    {
        $this->competitions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;

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
            $competition->addParticipantCategory($this);
        }

        return $this;
    }

    public function removeCompetition(Competition $competition): self
    {
        if ($this->competitions->removeElement($competition)) {
            $competition->removeParticipantCategory($this);
        }

        return $this;
    }
}
