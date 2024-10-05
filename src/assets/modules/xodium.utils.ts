// xodium.utils.ts
import { GithubService } from "xodium/utils/github";
import { CLICK_EVENT, FetchDataKey, FOCUS_OUT_EVENT } from "xodium/constants";

/**
 * Represents a GitHub member with essential details.
 *
 * @interface GitHubMember
 *
 * @property {string} login - The username of the GitHub member.
 * @property {string} avatar_url - The URL to the member's avatar image.
 * @property {string} html_url - The URL to the member's GitHub profile.
 */
interface GitHubMember {
  login: string;
  avatar_url: string;
  html_url: string;
  followers_url: string;
}

/**
 * Represents a GitHub release.
 *
 * @interface GitHubRelease
 *
 * @property {string} name - The name of the release.
 */
interface GitHubRelease {
  name: string;
}

/**
 * Utility class providing various helper methods.
 *
 * @class
 * @classdesc This class contains static methods for adding event listeners, handling toggle and scroll events,
 * toggling arrow direction, and populating a team grid with member data fetched from a GitHub service.
 */
export class Utils {
  /**
   * Adds event listeners for specified event types and methods.
   *
   * This method attaches event listeners for the provided event types and methods to the document.
   *
   * @static
   * @method
   * @param {Array<{ eventType: string[], method: (e: Event) => void }>} eventList - List of event types and corresponding methods.
   * @returns {void}
   */
  static eventListenerManager(
    eventList: Array<{ eventTypes: string[]; method: (e: Event) => void }>
  ): void {
    eventList.forEach(({ eventTypes, method }) => {
      eventTypes.forEach((eventType) => {
        document.addEventListener(eventType, method);
      });
    });
  }

  /**
   * Handles the visibility of a specified element based on the scroll position.
   *
   * @static
   * @method
   * @param {string} elClass - The ID of the element to show/hide.
   * @param {number} scrollThreshold - The scroll position threshold to trigger visibility.
   * @returns {void}
   */
  static handleElementVisibility(
    elClass: string,
    scrollThreshold: number
  ): void {
    document
      .querySelector(elClass)
      ?.classList.toggle(
        "hidden",
        document.body.scrollTop <= scrollThreshold &&
          document.documentElement.scrollTop <= scrollThreshold
      );
  }

  /**
   * Handles the toggle functionality for a given event.
   *
   * @param e - The event object.
   * @param attr - The attribute to get from the event target.
   * @param classtype - The class type to toggle on the target element.
   *
   * The function performs the following actions based on the event type:
   * - For a click event, it toggles the specified class on the target element and updates the arrow state.
   * - For a focus out event, it ensures the specified class is added to the target element and updates the arrow state.
   */
  static handleToggle = (e: Event, attr: string, classtype: string) => {
    const target = (e.target as HTMLElement).getAttribute(attr);
    if (target) {
      e.preventDefault();
      const el = document.getElementById(target);
      if (e.type === CLICK_EVENT) {
        const isOpen = !el?.classList.contains(classtype);
        el?.classList.toggle(classtype);
        Utils.toggleArrow({ isOpen });
      } else if (
        e.type === FOCUS_OUT_EVENT &&
        !el?.classList.contains(classtype)
      ) {
        if (!el?.contains((e as FocusEvent).relatedTarget as Node)) {
          el?.classList.add(classtype);
          Utils.toggleArrow({ isOpen: true });
        }
      }
    }
  };

  /**
   * Toggles the direction of an arrow element based on the provided state.
   *
   * @param {Object} param - The parameter object.
   * @param {boolean} param.isOpen - The state indicating whether the arrow should point down (true) or up (false).
   * @returns {void}
   */
  static toggleArrow = ({ isOpen }: { isOpen: boolean }): void => {
    const arrow = document.querySelector(".arrow") as HTMLElement;
    if (arrow) {
      arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
    }
  };

  /**
   * Replaces the inner HTML content of specified target elements with data fetched from GitHub.
   *
   * @param replacements - An array of objects containing the source, target, and optional fallback content.
   * @param replacements[].source - The key used to fetch data from GitHub.
   * @param replacements[].target - The CSS selector of the target element whose content will be replaced.
   * @param replacements[].fallbackContent - Optional. The content to use if the fetched data is empty or an error occurs. Defaults to "n.a.".
   *
   * @returns A promise that resolves when all replacements are complete.
   * @throws Will log an error to the console if fetching data fails for any target.
   */
  static async replaceContents(
    replacements: {
      source: FetchDataKey;
      target: string;
      fallbackContent?: string;
    }[]
  ): Promise<void> {
    for (const { source, target, fallbackContent = "n.a." } of replacements) {
      try {
        const content = await GithubService.getData<GitHubRelease>(source);
        const el = document.querySelector(target);
        if (el)
          el.innerHTML =
            Array.isArray(content) && content.length > 0
              ? content[0].name
              : fallbackContent;
      } catch (err) {
        console.error("Error fetching content for target:", target, err);
      }
    }
  }

  /**
   * Populates the team grid with member data fetched from the GitHub service.
   *
   * This function retrieves member information from the GitHub service and dynamically
   * creates and appends list items to the team grid in the DOM. Each list item contains
   * member details such as their avatar, login name, and role.
   *
   * @returns {Promise<void>} A promise that resolves when the team grid has been populated.
   *
   * @throws Will log an error to the console if there is an issue fetching the team members.
   */
  static async populateTeamCards(): Promise<void> {
    try {
      const members = await GithubService.getData<GitHubMember>("members");
      const cards = document.querySelector(".team-cards");
      if (cards && Array.isArray(members)) {
        const fragment = document.createDocumentFragment();
        members.forEach((member) => {
          const card = document.createElement("li");
          card.innerHTML = `
            <div class="flex items-center gap-x-6 mb-4">
              <a href="${member.html_url}">
                <img
                  class="h-16 w-16 rounded-full"
                  src="${member.avatar_url}"
                  alt="${member.login} picture"
                />
              </a>
              <div>
                <h3 class="text-base font-semibold leading-7 tracking-tight text-gray-900 dark:text-slate-100">
                  ${member.login}
                </h3>
                <p class="text-sm font-semibold leading-6 text-[#CB2D3E]">
                  followers: ${member.followers_url.length}
                </p>
              </div>
            </div>
          `;
          fragment.appendChild(card);
        });
        cards.appendChild(fragment);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
    }
  }
}
