<?php

namespace App\Entity;

use App\Repository\NotificationTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NotificationTypeRepository::class)]
class NotificationType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $label = null;

    #[ORM\Column]
    private ?int $notification_code = null;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'notificationEnabled')]
    private Collection $subscribedUsers;

    #[ORM\ManyToMany(targetEntity: Competition::class, mappedBy: 'notificationsSended')]
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
        return $this->notification_code;
    }

    public function setNotificationCode(int $notification_code): self
    {
        $this->notification_code = $notification_code;

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

    public function addCompetitionAlreadyHandled(Competition $competitionAlreadyHandled): self
    {
        if (!$this->competitionAlreadyHandled->contains($competitionAlreadyHandled)) {
            $this->competitionAlreadyHandled->add($competitionAlreadyHandled);
            $competitionAlreadyHandled->addNotificationsSended($this);
        }

        return $this;
    }

    public function removeCompetitionAlreadyHandled(Competition $competitionAlreadyHandled): self
    {
        if ($this->competitionAlreadyHandled->removeElement($competitionAlreadyHandled)) {
            $competitionAlreadyHandled->removeNotificationsSended($this);
        }

        return $this;
    }
}
