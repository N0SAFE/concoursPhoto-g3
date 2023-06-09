<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\SocialNetworksRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[
    ApiResource(
        operations: [new GetCollection(), new Get(), new Post(), new Patch()],
        normalizationContext: ['groups' => ['socialNetworks:read']]
    )
]
#[ORM\Entity(repositoryClass: SocialNetworksRepository::class)]
class SocialNetworks
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['socialNetworks:read'])]
    private ?int $id = null;

    #[Groups(['socialNetworks:read', 'user:current:read'])]
    #[ORM\Column(length: 255)]
    private ?string $label = null;

    #[ORM\OneToMany(mappedBy: 'socialNetworks', targetEntity: UserLink::class)]
    #[Groups('socialNetworks:userLinks:read')]
    private Collection $userLinks;

    #[ORM\OneToMany(mappedBy: 'socialNetworks', targetEntity: OrganizationLink::class)]
    #[Groups('socialNetworks:organizationLinks:read')]
    private Collection $organizationLinks;

    public function __construct()
    {
        $this->userLinks = new ArrayCollection();
        $this->organizationLinks = new ArrayCollection();
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
     * @return Collection<int, UserLink>
     */
    public function getUserLinks(): Collection
    {
        return $this->userLinks;
    }

    public function addUserLink(UserLink $userLink): self
    {
        if (!$this->userLinks->contains($userLink)) {
            $this->userLinks->add($userLink);
            $userLink->setSocialNetworks($this);
        }

        return $this;
    }

    public function removeUserLink(UserLink $userLink): self
    {
        if ($this->userLinks->removeElement($userLink)) {
            // set the owning side to null (unless already changed)
            if ($userLink->getSocialNetworks() === $this) {
                $userLink->setSocialNetworks(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, OrganizationLink>
     */
    public function getOrganizationLinks(): Collection
    {
        return $this->organizationLinks;
    }

    public function addOrganizationLink(
        OrganizationLink $organizationLink
    ): self {
        if (!$this->organizationLinks->contains($organizationLink)) {
            $this->organizationLinks->add($organizationLink);
            $organizationLink->setSocialNetworks($this);
        }

        return $this;
    }

    public function removeOrganizationLink(
        OrganizationLink $organizationLink
    ): self {
        if ($this->organizationLinks->removeElement($organizationLink)) {
            // set the owning side to null (unless already changed)
            if ($organizationLink->getSocialNetworks() === $this) {
                $organizationLink->setSocialNetworks(null);
            }
        }

        return $this;
    }
}
