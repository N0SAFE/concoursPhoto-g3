<?php

namespace App\Controller;

use App\Entity\File;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Service\FileUploader;

#[Route('/api', name: 'api_')]
class FileController extends AbstractController
{
    public function __construct(
        private FileUploader $fileUploader
    ){}

    #[Route('/uploads', name: 'app_upload_file', methods: ['POST'])]
    public function uploads(Request $request, ManagerRegistry $doctrine): Response
    {
        $em = $doctrine->getManager();

        $decoded = $request->request->all();
        $files = $request->files->get('files');

        $alreadyUploaded = [];

        if ($decoded["code"] === null) {
            return $this->json(['message' => 'Code is required']);
        } else if (!in_array($decoded["code"], $this->fileUploader->getAlloweds())) {
            return $this->json(['message' => 'Code is not allowed']);
        }

        try {
            foreach ($files as $file) {
                if (!$file instanceof UploadedFile) {
                    continue;
                }

                $alreadyUploaded[] = $this->fileUploader->upload($file, $decoded["code"]);

            }
        } catch (\Exception $e) {
            foreach ($alreadyUploaded as $file) {
                $this->fileUploader->unupload($decoded["code"], $file['path']);
            }

            return $this->json(['message' => $e->getMessage(), "trace" => $e->getTrace()], 500);
        }

        $filesUri = [];

        foreach($alreadyUploaded as $fileOptions) {
            $file = new File();

            $file->setPath($fileOptions['path']);
            $file->setSize($fileOptions['size']);
            $file->setExtension($fileOptions['extension']);
            $file->setType($fileOptions['type']);
            $file->setDefaultName($fileOptions['default_name']);

            $em->persist($file);
            $em->flush();

            $filesUri[] = sprintf('/api/files/%s', $file->getId());
        }

        return $this->json(['message' => 'Uploaded Successfully', 'data' => $filesUri]);
    }
}
