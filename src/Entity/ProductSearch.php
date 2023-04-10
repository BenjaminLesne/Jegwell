<?php

namespace App\Entity;

class ProductSearch
{
    /**
     * @var Category
     */
    private $category;

    /**
     * @var string
     */
    private $sort;

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    /**
     * @param Category $category
     */
    public function setCategory($category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getSort(): ?string
    {
        return $this->sort;
    }

    /**
     * @param string $sort
     */
    public function setSort($sort): self
    {
        $this->sort = $sort;

        return $this;
    }
}
