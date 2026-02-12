# Creating Alpha and Beta Release Issues

This guide helps you quickly create the alpha and beta release tracking issues in GitHub.

---

## Quick Start

### Option 1: Use GitHub UI (Recommended)

1. Go to the **Issues** tab in GitHub
2. Click **New Issue**
3. Select either **Alpha Release** or **Beta Release** template
4. Fill in the bracketed fields (e.g., `[Date]`, `[Team Lead]`)
5. Click **Submit new issue**

### Option 2: Use GitHub CLI

```bash
# Install GitHub CLI if you haven't already
# https://cli.github.com/

# Create Alpha Release Issue
gh issue create \
  --title "Alpha Release v0.1.0 - February 24, 2026" \
  --label "release,alpha,P0-critical,phase-2" \
  --milestone "Phase 2 - Features" \
  --assignee "@me" \
  --body-file .github/ISSUE_TEMPLATE/alpha-release.md

# Create Beta Release Issue
gh issue create \
  --title "Beta Release v0.2.0 - March 11, 2026" \
  --label "release,beta,P0-critical,phase-3" \
  --milestone "Phase 3 - Polish" \
  --assignee "@me" \
  --body-file .github/ISSUE_TEMPLATE/beta-release.md
```

---

## Recommended Issue Creation Timeline

### Week 1 (Feb 11-17): Phase 1 Development
**Action:** Focus on Phase 1 implementation  
**Issues to Create:** Phase 1 issues (#1-12) if not already created

### Week 2 (Feb 18-24): Phase 1 Wrap-up
**Action:** Create Alpha Release issue  
**When:** Feb 21 (3 days before alpha target date)  
**Issue:** "Alpha Release v0.1.0 - February 24, 2026"

```bash
gh issue create \
  --title "Alpha Release v0.1.0 - February 24, 2026" \
  --label "release,alpha,P0-critical,phase-2" \
  --milestone "Phase 2 - Features" \
  --body-file .github/ISSUE_TEMPLATE/alpha-release.md
```

### Week 3 (Feb 25-Mar 3): Alpha Testing + Phase 2 Start
**Action:** Monitor Alpha, start Phase 2  
**Alpha Status:** Active testing

### Week 4 (Mar 4-10): Phase 2 Development
**Action:** Create Beta Release issue  
**When:** Mar 6 (5 days before beta target date)  
**Issue:** "Beta Release v0.2.0 - March 11, 2026"

```bash
gh issue create \
  --title "Beta Release v0.2.0 - March 11, 2026" \
  --label "release,beta,P0-critical,phase-3" \
  --milestone "Phase 3 - Polish" \
  --body-file .github/ISSUE_TEMPLATE/beta-release.md
```

### Week 5-6 (Mar 11-24): Beta Testing + Phase 3
**Action:** Monitor Beta, continue Phase 3  
**Beta Status:** Active testing (Beta 1 & Beta 2)

### Week 7 (Mar 25-31): Launch Week
**Action:** Release Candidate and Production Launch  
**Issues:** Create launch-specific issues as needed

---

## Issue Template Customization

Before creating issues, you may want to customize the templates:

### Fields to Fill In

Both templates have placeholder fields marked with `[brackets]`:

**Alpha Release Template:**
- `[Date]` → Target date (e.g., "February 24, 2026")
- `[Team Lead / Release Manager]` → Assignee name

**Beta Release Template:**
- `[Date]` → Target date (e.g., "March 11, 2026")
- `[Release Manager / Product Lead]` → Assignee name
- `[List any known bugs...]` → Document known limitations

### Updating Checklist Items

You can customize the checklist items to match your specific needs:
- Add platform-specific requirements
- Remove items that don't apply
- Add team-specific processes
- Link to your team's documentation

---

## Labels to Create

Make sure these labels exist in your repository before creating issues:

```bash
# Create labels using GitHub CLI
gh label create "release" --color "0e8a16" --description "Release tracking issue"
gh label create "alpha" --color "d4c5f9" --description "Alpha release"
gh label create "beta" --color "c5def5" --description "Beta release"

# If not already created:
gh label create "P0-critical" --color "d73a4a" --description "Must be completed for launch"
gh label create "phase-2" --color "0079bf" --description "Phase 2: Features"
gh label create "phase-3" --color "61bd4f" --description "Phase 3: Polish"
```

---

## Milestones to Create

Create these milestones if they don't exist:

```bash
# Create milestones
gh api repos/:owner/:repo/milestones -f title="Phase 2 - Features" -f due_on="2026-03-10T00:00:00Z"
gh api repos/:owner/:repo/milestones -f title="Phase 3 - Polish" -f due_on="2026-03-24T00:00:00Z"
```

Or create via GitHub UI:
1. Go to **Issues** → **Milestones**
2. Click **New milestone**
3. Add title and due date
4. Click **Create milestone**

---

## Linking Issues

When creating alpha/beta issues, link them to related issues:

### In Issue Description
Use GitHub's issue linking syntax:
- `Depends on: #1, #2, #3` - Issues that must be completed first
- `Blocks: #50` - Issues blocked by this one
- `Related: #13-22` - Related issues

### In Commits
Reference issues in commit messages:
- `refs #36` - Reference the issue
- `closes #36` - Auto-close issue when merged

### In Pull Requests
Link PRs to issues:
- Add `Closes #36` in PR description to auto-close issue when merged

---

## Tracking Progress

### During Alpha/Beta Testing

1. **Daily:** Check off completed items in the issue
2. **Weekly:** Update issue with summary comment
3. **When blocked:** Comment with blocker details and tag relevant people
4. **After testing:** Add final summary comment before closing

### Status Updates Format

```markdown
## Week 1 Update (Feb 24-Mar 3)

### Progress
- ✅ Alpha build deployed to all platforms
- ✅ 5 internal testers onboarded
- ⏳ Collecting initial feedback

### Findings
- Found 2 P0 bugs (created issues #XX, #YY)
- Positive feedback on timer UI
- Need to improve onboarding flow

### Next Steps
- Fix critical bugs by Mar 1
- Expand testing to additional devices
- Prepare Beta 1 based on learnings
```

---

## Issue Automation

Consider setting up GitHub Actions for automation:

### Auto-label PRs
Automatically add labels based on which files are changed

### Stale Issue Management
Close issues that haven't been updated in 30+ days

### Issue Template Enforcement
Require issue templates for all new issues

---

## Best Practices

### For Alpha Issues
✅ **DO:**
- Create 3-5 days before alpha target date
- Assign to release manager/lead
- Update daily during testing period
- Document all findings thoroughly

❌ **DON'T:**
- Create too early (issues get stale)
- Leave checklist items unchecked without explanation
- Close before all testing is complete

### For Beta Issues
✅ **DO:**
- Create 5-7 days before beta target date
- Link to alpha learnings and fixes
- Track metrics (crash rate, engagement)
- Celebrate successes and milestones

❌ **DON'T:**
- Skip beta testing to meet deadlines
- Ignore negative feedback
- Rush through the checklist

---

## Troubleshooting

### Issue Template Not Appearing
**Problem:** Templates don't show up when creating new issue  
**Solution:** 
- Check files are in `.github/ISSUE_TEMPLATE/` directory
- Ensure YAML frontmatter is valid
- Clear browser cache

### Can't Assign Issue
**Problem:** Can't assign issue to team member  
**Solution:**
- Ensure person is a repository collaborator
- Check GitHub permissions

### Milestone Doesn't Exist
**Problem:** Can't set milestone when creating issue  
**Solution:**
- Create milestone first via Issues → Milestones
- Or use GitHub CLI to create it

---

## Quick Reference Commands

```bash
# List all issues
gh issue list

# List release issues
gh issue list --label release

# View specific issue
gh issue view 36

# Update issue
gh issue edit 36 --add-label "in-progress"

# Close issue
gh issue close 36 --comment "Alpha testing complete!"

# Reopen issue
gh issue reopen 36
```

---

## Examples

### Example Alpha Issue Title
```
Alpha Release v0.1.0 - February 24, 2026
```

### Example Beta Issue Title
```
Beta Release v0.2.0 - March 11, 2026
```

### Example Issue Description Update
When creating the issue, replace template placeholders:

**Before:**
```markdown
**Target Date:** [Insert target date - typically end of Phase 1/early Phase 2]
```

**After:**
```markdown
**Target Date:** February 24, 2026
```

---

## Related Documents

- [Release Schedule](../RELEASE_SCHEDULE.md) - Detailed release timeline
- [Alpha Release Template](./.github/ISSUE_TEMPLATE/alpha-release.md) - Alpha issue template
- [Beta Release Template](./.github/ISSUE_TEMPLATE/beta-release.md) - Beta issue template
- [Production Readiness Plan](../PRODUCTION_READINESS_PLAN.md) - Complete roadmap
- [GitHub Issues Quick Guide](../GITHUB_ISSUES_QUICK_GUIDE.md) - General issue management

---

## Need Help?

- **Questions about templates:** Check template files in `.github/ISSUE_TEMPLATE/`
- **Timeline questions:** See `RELEASE_SCHEDULE.md`
- **Process questions:** Ask in team channel or open a discussion

---

**Last Updated:** February 12, 2026  
**Maintained By:** Development Team
