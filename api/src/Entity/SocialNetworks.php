<?php

namespace App\Entity;

use App\Repository\SocialNetworksRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SocialNetworksRepository::class)]
class SocialNetworks
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['user:read', 'user:current:read'])]
    #[ORM\Column(length: 255)]
    private ?string $label = null;

    #[ORM\OneToMany(mappedBy: 'social_networks', targetEntity: UserLink::class)]
    private Collection $userLinks;

    #[ORM\OneToMany(mappedBy: 'social_networks', targetEntity: OrganizationLink::class)]
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

    public function addOrganizationLink(OrganizationLink $organizationLink): self
    {
        if (!$this->organizationLinks->contains($organizationLink)) {
            $this->organizationLinks->add($organizationLink);
            $organizationLink->setSocialNetworks($this);
        }

        return $this;
    }

    public function removeOrganizationLink(OrganizationLink $organizationLink): self
    {
        if ($this->organizationLinks->removeElement($organizationLink)) {
            // set the owning side to null (unless already changed)
            if ($organizationLink->getSocialNetworks() === $this) {
                $organizationLink->setSocialNetworks(null);
            }
        }

        return $this;
    }
}
