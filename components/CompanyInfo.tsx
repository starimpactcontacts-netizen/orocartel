import { site } from '@/lib/site'

// Seller details required by Swedish e-commerce law. Lines without a value are skipped.
export default function CompanyInfo() {
  const c = site.company
  return (
    <p>
      {c.legalName || site.name}
      {c.orgNumber && (
        <>
          <br />
          Org. no. {c.orgNumber}
        </>
      )}
      {c.vatNumber && (
        <>
          <br />
          VAT no. {c.vatNumber}
        </>
      )}
      <br />
      {c.address || 'Sweden'}
      <br />
      <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
    </p>
  )
}
