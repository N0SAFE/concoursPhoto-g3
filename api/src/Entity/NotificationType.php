<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\NotificationTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[
    ApiResource(
        operations: [
            new GetCollection(),
            new Post(),
            new Get(),
            new Patch(),
            new Delete(),
        ],
        normalizationContext: ['groups' => ['notificationType:read']]
    )
]
#[ORM\Entity(repositoryClass: NotificationTypeRepository::class)]
class NotificationType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['notificationType:read', 'user:current:read'])]
    private ?int $id = null;

    #[Groups(['notificationType:read', 'user:current:read'])]
    #[ORM\Column(length: 255)]
    private ?string $label = null;

    #[Groups(['notificationType:read', 'user:current:read'])]
    #[ORM\Column]
    private ?int $notificationCode = null;

    #[Groups(['notificationType:subscribedUsers:read'])]
    #[
        ORM\ManyToMany(
            targetEntity: User::class,
            mappedBy: 'notificationEnabled'
        )
    ]
    private Collection $subscribedUsers;

    #[Groups(['notificationType:competitionAlreadyHandled:read'])]
    #[
        ORM\ManyToMany(
            targetEntity: Competition::class,
            mappedBy: 'notificationsSended'
        )
    ]
    private Collection $competitionAlreadyHandled;

    public function __construct()
    {
        $this->subscribedUsers = new ArrayCollection();
        $this->competitionAlreadyHandled = new ArrayCollection();
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

    public function getNotificationCode(): ?int
    {
        return $this->notificationCode;
    }

    public function setNotificationCode(int $notificationCode): self
    {
        $this->notificationCode = $notificationCode;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getSubscribedUsers(): Collection
    {
        return $this->subscribedUsers;
    }

    public function addSubscribedUser(User $subscribedUser): self
    {
        if (!$this->subscribedUsers->contains($subscribedUser)) {
            $this->subscribedUsers->add($subscribedUser);
            $subscribedUser->addNotificationEnabled($this);
        }

        return $this;
    }

    public function removeSubscribedUser(User $subscribedUser): self
    {
        if ($this->subscribedUsers->removeElement($subscribedUser)) {
            $subscribedUser->removeNotificationEnabled($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Competition>
     */
    public function getCompetitionAlreadyHandled(): Collection
    {
        return $this->competitionAlreadyHandled;
    }

    public function addCompetitionAlreadyHandled(
        Competition $competitionAlreadyHandled
    ): self {
        if (
            !$this->competitionAlreadyHandled->contains(
                $competitionAlreadyHandled
            )
        ) {
            $this->competitionAlreadyHandled->add($competitionAlreadyHandled);
            $competitionAlreadyHandled->addNotificationsSended($this);
        }

        return $this;
    }

    public function removeCompetitionAlreadyHandled(
        Competition $competitionAlreadyHandled
    ): self {
        if (
            $this->competitionAlreadyHandled->removeElement(
                $competitionAlreadyHandled
            )
        ) {
            $competitionAlreadyHandled->removeNotificationsSended($this);
        }

        return $this;
    }
}
