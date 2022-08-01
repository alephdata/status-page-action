import sanitizeHtml from 'sanitize-html';

function sanitizeHtmlWrapper(html = '') {
  const options = {
    allowedTags: ['a'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    },
  };

  return sanitizeHtml(html, options);
}

function escapeHtml(html = '') {
  return sanitizeHtml(html, {
    allowedTags: [],
    disallowedTagsMode: 'escape',
  });
}

function html(literals, ...substitutions) {
  // Minimal templating based on:
  // https://2ality.com/2015/01/template-strings-html.html

  const raw = literals.raw;
  let result = '';

  substitutions.forEach((substitution, i) => {
    let literal = raw[i];

    // Convert array values into strings
    if (Array.isArray(substitution)) {
      substitution = substitution.join('');
    }

    // Ignore null, undefined, false
    if ([null, undefined, false].includes(substitution)) {
      substitution = '';
    }

    // Escape substitutions by default, except if substituion
    // is preceded by a dollar sign.
    if (!literal.endsWith('$')) {
      substitution = escapeHtml(substitution);
    } else {
      literal = literal.slice(0, -1);
    }

    result += literal;
    result += substitution;
  });

  // Append the last literal
  result += raw[raw.length - 1];

  return result;
}

function formatDate(date, format = 'long') {
  const options =
    format === 'short'
      ? { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
      : {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        };

  return new Date(date).toLocaleDateString('en-US', options);
}

export { sanitizeHtmlWrapper as sanitizeHtml, escapeHtml, html, formatDate };
