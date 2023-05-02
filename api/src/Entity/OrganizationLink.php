<?php

namespace App\Entity;

use App\Repository\OrganizationLinkRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrganizationLinkRepository::class)]
class OrganizationLink
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'organizationLinks')]
    private ?Organization $organization = null;

    #[ORM\ManyToOne(inversedBy: 'organizationLinks')]
    private ?SocialNetworks $social_networks = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $link = null;

    public function getId(): ?int
    {
        return $this->id;
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
