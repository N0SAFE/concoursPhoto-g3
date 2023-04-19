<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MemberOfTheJuryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[ORM\Entity(repositoryClass: MemberOfTheJuryRepository::class)]
class MemberOfTheJury
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('competition')]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'memberOfTheJuries')]
    #[Groups('competition')]
    private ?Competition $competition = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups('competition')]
    private ?\DateTimeInterface $invite_date = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups('competition')]
    private ?\DateTimeInterface $acceptance_date = null;

    #[ORM\Column(length: 255)]
    #[Groups('competition')]
    private ?string $theFunction = null;

    #[ORM\ManyToOne(inversedBy: 'memberOfTheJuries')]
    #[Groups('competition')]
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
        return $this->invite_date;
    }

    public function setInviteDate(\DateTimeInterface $invite_date): self
    {
        $this->invite_date = $invite_date;

        return $this;
    }

    public function getAcceptanceDate(): ?\DateTimeInterface
    {
        return $this->acceptance_date;
    }

    public function setAcceptanceDate(\DateTimeInterface $acceptance_date): self
    {
        $this->acceptance_date = $acceptance_date;

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
