<?php

namespace App\Entity;

use App\Repository\LinkRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LinkRepository::class)]
class Link
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $link = null;

    #[ORM\ManyToOne(inversedBy: 'links')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'links')]
    private ?SocialNetworks $socialnetworks = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getSocialnetworks(): ?SocialNetworks
    {
        return $this->socialnetworks;
    }

    public function setSocialnetworks(?SocialNetworks $socialnetworks): self
    {
        $this->socialnetworks = $socialnetworks;

        return $this;
    }
}
