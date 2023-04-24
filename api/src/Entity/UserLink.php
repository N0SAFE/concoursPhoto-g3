<?php

namespace App\Entity;

use App\Repository\UserLinkRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserLinkRepository::class)]
class UserLink
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'userLinks')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'userLinks')]
    private ?SocialNetworks $social_networks = null;

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
        return $this->social_networks;
    }

    public function setSocialNetworks(?SocialNetworks $social_networks): self
    {
        $this->social_networks = $social_networks;

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
