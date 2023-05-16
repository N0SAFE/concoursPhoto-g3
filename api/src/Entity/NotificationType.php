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

    #[ORM\OneToMany(mappedBy: 'notification', targetEntity: NotificationLink::class)]
    private Collection $notificationLinks;

    #[ORM\Column]
    private ?int $notification_code = null;

    public function __construct()
    {
        $this->notificationLinks = new ArrayCollection();
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
     * @return Collection<int, NotificationLink>
     */
    public function getNotificationLinks(): Collection
    {
        return $this->notificationLinks;
    }

    public function addNotificationLink(NotificationLink $notificationLink): self
    {
        if (!$this->notificationLinks->contains($notificationLink)) {
            $this->notificationLinks->add($notificationLink);
            $notificationLink->setNotification($this);
        }

        return $this;
    }

    public function removeNotificationLink(NotificationLink $notificationLink): self
    {
        if ($this->notificationLinks->removeElement($notificationLink)) {
            // set the owning side to null (unless already changed)
            if ($notificationLink->getNotification() === $this) {
                $notificationLink->setNotification(null);
            }
        }

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
}
