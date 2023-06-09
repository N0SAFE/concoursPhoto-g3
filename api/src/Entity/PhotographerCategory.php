<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PhotographerCategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[
    ApiResource(
        operations: [new GetCollection(), new Get(), new Post(), new Patch()],
        normalizationContext: ['groups' => ['photographerCategory:read']]
    )
]
#[ORM\Entity(repositoryClass: PhotographerCategoryRepository::class)]
class PhotographerCategory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['photographerCategory:read', 'user:current:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['photographerCategory:read', 'user:current:read'])]
    private ?string $label = null;

    #[
        ORM\OneToMany(
            mappedBy: 'photographerCategory',
            targetEntity: User::class
        )
    ]
    #[Groups('photographerCategory:users:read')]
    private Collection $users;

    public function __construct()
    {
        $this->users = new ArrayCollection();
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
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->setPhotographerCategory($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getPhotographerCategory() === $this) {
                $user->setPhotographerCategory(null);
            }
        }

        return $this;
    }
}
