<?php

namespace App\Entity;

use App\Repository\PersonalStatutRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[
    ApiResource(
        operations: [new GetCollection(), new Get(), new Post(), new Patch()],
        normalizationContext: ['groups' => ['personalStatut:read']]
    )
]
#[ORM\Entity(repositoryClass: PersonalStatutRepository::class)]
class PersonalStatut
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['personalStatut:read', 'user:current:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['personalStatut:read', 'user:current:read'])]
    private ?string $label = null;

    #[Groups(['personalStatut:users:read', 'user:current:read'])]
    #[ORM\OneToMany(mappedBy: 'personalStatut', targetEntity: User::class)]
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
            $user->setPersonalStatut($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getPersonalStatut() === $this) {
                $user->setPersonalStatut(null);
            }
        }

        return $this;
    }
}
