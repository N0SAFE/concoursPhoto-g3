<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\UserLinkRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch()
    ],
    normalizationContext: ["groups" => ["userLink:read"]],
)]
#[ORM\Entity(repositoryClass: UserLinkRepository::class)]
class UserLink
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['userLink:read', 'user:current:read'])]
    private ?int $id = null;

    #[Groups(['userLink:user:read', 'user:current:read'])]
    #[ORM\ManyToOne(inversedBy: 'userLinks')]
    private ?User $user = null;

    #[Groups(['userLink:socialNetworks:read', 'user:current:read'])]
    #[ORM\ManyToOne(inversedBy: 'userLinks')]
    private ?SocialNetworks $socialNetworks = null;

    #[Groups(['userLink:read', 'user:current:read'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $link = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getSocialNetworks(): ?SocialNetworks
    {
        return $this->socialNetworks;
    }

    public function setSocialNetworks(?SocialNetworks $socialNetworks): self
    {
        $this->socialNetworks = $socialNetworks;

        return $this;
    }

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(?string $link): self
    {
        $this->link = $link;

        return $this;
    }
}
