<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\VoteRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Serializer\Filter\GroupFilter;

#[ApiFilter(
    GroupFilter::class,
)]
#[ApiFilter(
    SearchFilter::class,
)]
#[
    ApiResource(
        operations: [new GetCollection(), new Get(), new Post(
            securityPostDenormalize: 'is_granted("VOTE_EDIT", object)',
            securityPostDenormalizeMessage: 'You have passed the maximum number of votes for a competition.'
        ), new Patch(), new Delete()],
        normalizationContext: ['groups' => ['vote:read']]
    )
]
#[ORM\Entity(repositoryClass: VoteRepository::class)]
class Vote
{
    #[Groups('vote:read')]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['vote:picture:read', 'user:current:read'])]
    #[ORM\ManyToOne(inversedBy: 'votes')]
    private ?Picture $picture = null;

    #[Groups('vote:read')]
    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $voteDate = null;

    #[Groups('vote:user:read')]
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
        return $this->voteDate;
    }

    public function setVoteDate(\DateTimeInterface $voteDate): self
    {
        $this->voteDate = $voteDate;

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
