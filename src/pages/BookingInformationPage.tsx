import { FormEvent, KeyboardEvent, useState } from "react";
import { CalendarDays, Check, ShieldCheck } from "lucide-react";
import "./BookingInformationPage.css";

type FieldName =
  | "fullName"
  | "email"
  | "bookingReference"
  | "spaceValidationCode"
  | "phone"
  | "documentId";

type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

const initialValues: FormValues = {
  fullName: "",
  email: "",
  bookingReference: "",
  spaceValidationCode: "",
  phone: "",
  documentId: "",
};

const fieldValidators: Record<FieldName, (value: string) => string> = {
  fullName: (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return "Please enter your full name.";
    if (trimmedValue.length < 2)
      return "Full name must contain at least 2 characters.";
    if (!/^[\p{L}\s.'-]+$/u.test(trimmedValue)) {
      return "Full name can only contain letters, spaces, apostrophes, periods, or hyphens.";
    }

    return "";
  },
  email: (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return "Enter an email in the format name@example.com.";
    }

    return "";
  },
  bookingReference: (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return "Please enter your booking reference.";
    if (!/^BK-\d{6}$/i.test(trimmedValue)) {
      return "Use the format BK- followed by 6 digits, for example BK-123456.";
    }

    return "";
  },
  spaceValidationCode: (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return "Please enter your space-validation code.";
    if (!/^SP-\d{4}$/i.test(trimmedValue)) {
      return "Use the format SP- followed by 4 digits, for example SP-1234.";
    }

    return "";
  },
  phone: (value) => {
    const trimmedValue = value.trim();
    const digitsOnly = trimmedValue.replace(/[\s()-]/g, "");

    if (!trimmedValue) return "Please enter your phone number.";
    if (!/^\+?\d{9,15}$/.test(digitsOnly)) {
      return "Enter a valid phone number with 9 to 15 digits.";
    }

    return "";
  },
  documentId: (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return "Please enter your ID or passport number.";
    if (!/^[A-Za-z0-9]{6,12}$/.test(trimmedValue)) {
      return "ID or passport number must be 6 to 12 letters or numbers.";
    }

    return "";
  },
};

const validateForm = (values: FormValues): FormErrors =>
  (Object.keys(values) as FieldName[]).reduce<FormErrors>((errors, field) => {
    const message = fieldValidators[field](values[field]);
    if (message) errors[field] = message;
    return errors;
  }, {});

export const BookingInformationPage = () => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submittedName, setSubmittedName] = useState("");

  const updateField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSubmittedName("");

    const shouldValidateImmediately = field === "bookingReference";

    if (shouldValidateImmediately && !touched[field]) {
      setTouched((current) => ({ ...current, [field]: true }));
    }

    const shouldRevalidateTouchedField =
      touched[field] && field !== "spaceValidationCode";

    if (shouldValidateImmediately || shouldRevalidateTouchedField) {
      const message = fieldValidators[field](value);
      setErrors((current) => ({ ...current, [field]: message || undefined }));
    }
  };

  const validateField = (field: FieldName) => {
    const message = fieldValidators[field](values[field]);
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: message || undefined }));
  };

  const validateSpaceField = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== " ") return;

    event.preventDefault();
    validateField("spaceValidationCode");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(values);
    const allTouched = (
      Object.keys(values) as FieldName[]
    ).reduce<TouchedFields>(
      (result, field) => ({ ...result, [field]: true }),
      {},
    );

    setTouched(allTouched);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = (Object.keys(values) as FieldName[]).find(
        (field) => nextErrors[field],
      );
      if (firstInvalidField)
        document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setSubmittedName(values.fullName.trim());
  };

  const inputClassName = (field: FieldName) =>
    `booking-form__input${errors[field] ? " booking-form__input--error error" : ""}`;

  return (
    <div className="booking-page">
      <section className="booking-card" aria-labelledby="booking-title">
        <div className="booking-card__intro">
          <div className="booking-card__eyebrow">
            <span className="booking-card__icon" aria-hidden="true">
              <CalendarDays size={18} />
            </span>
            Your reservation
          </div>
          <h1 id="booking-title">Booking information</h1>
          <p>
            Tell us who is joining. We’ll use these details only to manage your
            booking and send important updates.
          </p>

          <div className="booking-card__security">
            <ShieldCheck size={20} aria-hidden="true" />
            <span>Your personal information is securely protected.</span>
          </div>
        </div>

        <div className="booking-card__form-area">
          <div className="booking-card__step" aria-label="Step 1 of 2">
            <span>Step 1 of 2</span>
            <span className="booking-card__step-line" aria-hidden="true">
              <span />
            </span>
          </div>

          <form className="booking-form" onSubmit={handleSubmit} noValidate>
            <div className="booking-form__heading">
              <h2>Personal details</h2>
              <p>All fields are required.</p>
            </div>

            <div className="booking-form__field booking-form__field--wide">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="e.g. Alex Morgan"
                value={values.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                onBlur={() => validateField("fullName")}
                className={inputClassName("fullName")}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={
                  errors.fullName ? "fullName-error" : undefined
                }
                data-test="booking-full-name"
              />
              {errors.fullName && (
                <p
                  id="fullName-error"
                  className="booking-form__error"
                  role="alert"
                >
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="booking-form__field booking-form__field--wide">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                onBlur={() => validateField("email")}
                className={inputClassName("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                data-test="booking-email"
              />
              {errors.email && (
                <p
                  id="email-error"
                  className="booking-form__error"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="booking-form__field booking-form__field--wide">
              <label htmlFor="bookingReference">
                Booking reference
                <span className="booking-form__label-note">
                  Auto validation
                </span>
              </label>
              <input
                id="bookingReference"
                name="bookingReference"
                type="text"
                autoComplete="off"
                placeholder="BK-123456"
                value={values.bookingReference}
                onChange={(event) =>
                  updateField("bookingReference", event.target.value)
                }
                onBlur={() => validateField("bookingReference")}
                className={inputClassName("bookingReference")}
                aria-invalid={Boolean(errors.bookingReference)}
                aria-describedby={
                  errors.bookingReference
                    ? "bookingReference-error"
                    : "bookingReference-hint"
                }
                data-test="booking-reference-auto-validation"
              />
              {!errors.bookingReference && (
                <p id="bookingReference-hint" className="booking-form__hint">
                  Validated automatically while you type. Format: BK-123456.
                </p>
              )}
              {errors.bookingReference && (
                <p
                  id="bookingReference-error"
                  className="booking-form__error"
                  role="alert"
                >
                  {errors.bookingReference}
                </p>
              )}
            </div>

            <div className="booking-form__field booking-form__field--wide">
              <label htmlFor="spaceValidationCode">
                Space-validation code
                <span className="booking-form__label-note">
                  Press Space to validate
                </span>
              </label>
              <input
                id="spaceValidationCode"
                name="spaceValidationCode"
                type="text"
                autoComplete="off"
                placeholder="SP-1234"
                value={values.spaceValidationCode}
                onChange={(event) =>
                  updateField("spaceValidationCode", event.target.value)
                }
                onKeyDown={validateSpaceField}
                className={inputClassName("spaceValidationCode")}
                aria-invalid={Boolean(errors.spaceValidationCode)}
                aria-describedby={
                  errors.spaceValidationCode
                    ? "spaceValidationCode-error"
                    : "spaceValidationCode-hint"
                }
                data-test="booking-space-validation-code"
              />
              {!errors.spaceValidationCode && (
                <p id="spaceValidationCode-hint" className="booking-form__hint">
                  Enter a code, then press Space to run validation.
                </p>
              )}
              {errors.spaceValidationCode && (
                <p
                  id="spaceValidationCode-error"
                  className="booking-form__error"
                  role="alert"
                >
                  {errors.spaceValidationCode}
                </p>
              )}
            </div>

            <div className="booking-form__field">
              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+84 912 345 678"
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                onBlur={() => validateField("phone")}
                className={inputClassName("phone")}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                data-test="booking-phone"
              />
              {errors.phone && (
                <p
                  id="phone-error"
                  className="booking-form__error"
                  role="alert"
                >
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="booking-form__field">
              <label htmlFor="documentId">ID / Passport number</label>
              <input
                id="documentId"
                name="documentId"
                type="text"
                autoComplete="off"
                placeholder="e.g. A1234567"
                value={values.documentId}
                onChange={(event) =>
                  updateField("documentId", event.target.value)
                }
                onBlur={() => validateField("documentId")}
                className={inputClassName("documentId")}
                aria-invalid={Boolean(errors.documentId)}
                aria-describedby={
                  errors.documentId ? "documentId-error" : undefined
                }
                data-test="booking-document-id"
              />
              {errors.documentId && (
                <p
                  id="documentId-error"
                  className="booking-form__error"
                  role="alert"
                >
                  {errors.documentId}
                </p>
              )}
            </div>

            {submittedName && (
              <div
                className="booking-form__success"
                role="status"
                data-test="booking-success"
              >
                <span aria-hidden="true">
                  <Check size={16} />
                </span>
                Thanks, {submittedName}. Your information is ready for the next
                step.
              </div>
            )}

            <button
              className="booking-form__submit"
              type="submit"
              data-test="booking-submit"
            >
              Continue to booking details
              <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
