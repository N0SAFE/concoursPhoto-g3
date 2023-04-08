<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\VoteRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[ORM\Entity(repositoryClass: VoteRepository::class)]
class Vote
{
    #[Groups('competition')]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups('competition')]
    #[ORM\ManyToOne(inversedBy: 'votes')]
    private ?Picture $picture = null;

    #[Groups('competition')]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $vote_date = null;

    #[Groups('competition')]
    #[ORM\ManyToOne(inversedBy: 'votes')]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPicture(): ?Picture
    {
        return $this->picture;
    }

    public function setPicture(?Picture $picture): self
    {
        $this->picture = $picture;

        return $this;
    }

    public function getVoteDate(): ?\DateTimeInterface
    {
        return $this->vote_date;
    }

    public function setVoteDate(\DateTimeInterface $vote_date): self
    {
        $this->vote_date = $vote_date;

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
