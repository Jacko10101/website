The downloadable CV is built from `cv.tex`. Keep its figures and project scope consistent with `lib/case-studies.ts`.

Rebuild from the repository root using Tectonic:

```sh
tectonic -X compile documents/cv.tex --outdir public
```

Check that `public/cv.pdf` remains one page and review it before committing both files.
