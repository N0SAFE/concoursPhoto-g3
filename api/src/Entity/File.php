<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\FileRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Controller\FileController;
use Symfony\Component\HttpFoundation\File\File as FileFile;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(operations: [
    new GetCollection(),
    new Post(controller: FileController::class, deserialize: false),
    new Get(),
    new Delete()
])]
#[ORM\Entity(repositoryClass: FileRepository::class)]
class File
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file'])]
    private ?string $path = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file'])]
    private ?string $size = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file'])]
    private ?string $extension = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file'])]
    private ?string $type = null;

    #[ORM\Column(length: 255)]
    #[Groups(['file'])]
    private ?string $default_name = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;

        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(string $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getExtension(): ?string
    {
        return $this->extension;
    }

    public function setExtension(string $extension): self
    {
        $this->extension = $extension;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getDefaultName(): ?string
    {
        return $this->default_name;
    }

    public function setDefaultName(string $default_name): self
    {
        $this->default_name = $default_name;

        return $this;
    }
}
