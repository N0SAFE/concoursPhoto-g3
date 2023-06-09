<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\OrganizationLinkRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[
    ApiResource(
        operations: [new GetCollection(), new Get(), new Post(), new Patch()],
        normalizationContext: ['groups' => ['organizationLink:read']],
        denormalizationContext: ['groups' => ['organizationLink:write']]
    )
]
#[ORM\Entity(repositoryClass: OrganizationLinkRepository::class)]
class OrganizationLink
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['organizationLink:read'])]
    private ?int $id = null;

    #[Groups(['organizationLink:organization:read', 'organizationLink:read', 'organizationLink:write'])]
    #[ORM\ManyToOne(inversedBy: 'organizationLinks')]
    private ?Organization $organization = null;

    #[Groups(['organizationLink:socialNetworks:read', 'organizationLink:read', 'organizationLink:write'])]
    #[ORM\ManyToOne(inversedBy: 'organizationLinks')]
    private ?SocialNetworks $socialNetworks = null;

    #[Groups(['organizationLink:read', 'organizationLink:write'])]
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
