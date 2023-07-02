<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MemberOfTheJuryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[
    ApiResource(
        operations: [new GetCollection(), new Get(), new Post(), new Patch()],
        normalizationContext: ['groups' => ['memberOfTheJury:read']]
    )
]
#[ORM\Entity(repositoryClass: MemberOfTheJuryRepository::class)]
class MemberOfTheJury
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('memberOfTheJury:read')]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'memberOfTheJuries')]
    #[Groups('memberOfTheJury:competition:read')]
    private ?Competition $competition = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups('memberOfTheJury:read')]
    private ?\DateTimeInterface $inviteDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups('memberOfTheJury:read')]
    private ?\DateTimeInterface $acceptanceDate = null;

    #[ORM\Column(length: 255)]
    #[Groups(['memberOfTheJury:read'])]
    private ?string $theFunction = null;

    #[ORM\ManyToOne(inversedBy: 'memberOfTheJuries')]
    #[Groups('memberOfTheJury:user:read')]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCompetition(): ?Competition
    {
        return $this->competition;
    }

    public function setCompetition(?Competition $competition): self
    {
        $this->competition = $competition;

        return $this;
    }

    public function getInviteDate(): ?\DateTimeInterface
    {
        return $this->inviteDate;
    }

    public function setInviteDate(\DateTimeInterface $inviteDate): self
    {
        $this->inviteDate = $inviteDate;

        return $this;
    }

    public function getAcceptanceDate(): ?\DateTimeInterface
    {
        return $this->acceptanceDate;
    }

    public function setAcceptanceDate(\DateTimeInterface $acceptanceDate): self
    {
        $this->acceptanceDate = $acceptanceDate;

        return $this;
    }

    public function getTheFunction(): ?string
    {
        return $this->theFunction;
    }

    public function setTheFunction(string $theFunction): self
    {
        $this->theFunction = $theFunction;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
