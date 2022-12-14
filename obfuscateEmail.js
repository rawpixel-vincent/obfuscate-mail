const { getOptions, DEFAULT_OPTIONS } = require('./utils');

/**
 * Obfuscate an email.
 * @param {string} email
 * @param {import('./utils').Options} [options=DEFAULT_OPTIONS]
 * @returns {string}
 * @throws {Error} if an option type is invalid.
 */
const obfuscateEmail = (email, options = DEFAULT_OPTIONS) => {
  const opts = getOptions(options);

  if (
    typeof email !== 'string' ||
    email.length === 0 ||
    !email.includes('@') ||
    email.split('@').length !== 2
  ) {
    return opts.invalidEmailValue;
  }

  const [name, domain] = email.split('@');
  const [domainName, domainExtension = '***'] = domain.split('.');

  const visibleCharactersStartLength =
    opts.visibleCharactersStartLength > 0 && name.length > 1
      ? Math.min(
          name.length - opts.minimumNameObfuscationLength > 0
            ? name.length - opts.minimumNameObfuscationLength
            : 0,
          opts.visibleCharactersStartLength,
        )
      : 0;

  const visibleCharactersEndLength =
    opts.visibleCharactersEndLength > 0 &&
    name.length >
      visibleCharactersStartLength + opts.minimumNameObfuscationLength
      ? Math.min(
          name.length -
            visibleCharactersStartLength -
            opts.minimumNameObfuscationLength,
          opts.visibleCharactersEndLength,
        )
      : 0;

  const visibleCharactersMiddleLength =
    opts.visibleCharactersMiddleLength > 0 &&
    name.length -
      visibleCharactersStartLength -
      visibleCharactersEndLength -
      opts.minimumNameObfuscationLength >
      0
      ? Math.min(
          name.length -
            visibleCharactersStartLength -
            visibleCharactersEndLength -
            opts.minimumNameObfuscationLength,
          opts.visibleCharactersMiddleLength,
        )
      : 0;

  const charactersLeftToObfuscate = Math.max(
    0,
    name.length - visibleCharactersStartLength - visibleCharactersEndLength,
  );

  const middleCharacters =
    visibleCharactersMiddleLength > 0
      ? name
          .substring(visibleCharactersStartLength)
          .substring(
            Math.round(
              charactersLeftToObfuscate / 2 - visibleCharactersMiddleLength / 2,
            ),
          )
          .substring(0, visibleCharactersMiddleLength)
      : '';

  return `${name.substring(0, visibleCharactersStartLength)}${'*'.repeat(
    Math.max(1, Math.floor(opts.asterisksLength / 2)),
  )}${middleCharacters}${'*'.repeat(
    Math.max(1, Math.floor(opts.asterisksLength / 2)),
  )}${
    visibleCharactersEndLength > 0
      ? name.substring(name.length - visibleCharactersEndLength)
      : ''
  }@${
    opts.showDomainName
      ? domainName
      : '*'.repeat(Math.max(3, opts.asterisksLength - 3))
  }.${opts.showDomainExtension ? domainExtension : '***'}`;
};

module.exports = obfuscateEmail;
module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
